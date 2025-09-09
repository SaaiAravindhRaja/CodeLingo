import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';
import { geminiConfig, validateGeminiConfig, GEMINI_ERROR_MESSAGES } from '../config/gemini';
import { ChatbotError } from '../types/chatbot';
import { parseApiError } from '../utils/chatbot';

interface RateLimitState {
  requestCount: number;
  windowStart: number;
  isBlocked: boolean;
  blockUntil: number;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private rateLimitState: RateLimitState;
  private retryConfig: RetryConfig;
  
  // Rate limiting configuration
  private readonly MAX_REQUESTS_PER_MINUTE = 60;
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
  private readonly BLOCK_DURATION = 60 * 1000; // 1 minute block duration

  constructor() {
    this.rateLimitState = {
      requestCount: 0,
      windowStart: Date.now(),
      isBlocked: false,
      blockUntil: 0,
    };

    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 10000, // 10 seconds
      backoffMultiplier: 2,
    };

    this.initialize();
  }

  /**
   * Initialize the Gemini API client
   */
  private initialize(): void {
    try {
      if (!validateGeminiConfig()) {
        throw new Error('Invalid Gemini configuration');
      }

      this.genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
      
      const generationConfig: GenerationConfig = {
        temperature: geminiConfig.temperature || 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: geminiConfig.maxTokens || 1000,
      };

      this.model = this.genAI.getGenerativeModel({
        model: geminiConfig.model,
        generationConfig,
      });

      console.log('GeminiService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize GeminiService:', error);
      this.genAI = null;
      this.model = null;
    }
  }

  /**
   * Check if the service is properly initialized
   */
  private isInitialized(): boolean {
    return this.genAI !== null && this.model !== null;
  }

  /**
   * Check and update rate limiting state
   */
  private checkRateLimit(): boolean {
    const now = Date.now();

    // Check if we're currently blocked
    if (this.rateLimitState.isBlocked && now < this.rateLimitState.blockUntil) {
      return false;
    }

    // Reset block if block period has passed
    if (this.rateLimitState.isBlocked && now >= this.rateLimitState.blockUntil) {
      this.rateLimitState.isBlocked = false;
      this.rateLimitState.requestCount = 0;
      this.rateLimitState.windowStart = now;
    }

    // Reset window if it has expired
    if (now - this.rateLimitState.windowStart >= this.RATE_LIMIT_WINDOW) {
      this.rateLimitState.requestCount = 0;
      this.rateLimitState.windowStart = now;
    }

    // Check if we've exceeded the rate limit
    if (this.rateLimitState.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      this.rateLimitState.isBlocked = true;
      this.rateLimitState.blockUntil = now + this.BLOCK_DURATION;
      return false;
    }

    // Increment request count
    this.rateLimitState.requestCount++;
    return true;
  }

  /**
   * Calculate delay for exponential backoff
   */
  private calculateBackoffDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  /**
   * Sleep for specified duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryableError(error: any): boolean {
    const chatbotError = parseApiError(error);
    return chatbotError.retryable;
  }

  /**
   * Send a message to Gemini API with retry logic
   */
  async sendMessage(message: string): Promise<string> {
    // Validate initialization
    if (!this.isInitialized()) {
      throw new Error(GEMINI_ERROR_MESSAGES.MISSING_API_KEY);
    }

    // Validate input
    if (!message || message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (message.length > 4000) {
      throw new Error('Message is too long. Please keep it under 4000 characters.');
    }

    // Check rate limiting
    if (!this.checkRateLimit()) {
      const waitTime = Math.ceil((this.rateLimitState.blockUntil - Date.now()) / 1000);
      throw new Error(`⏱️ Slow down there, speed racer! Please wait ${waitTime} seconds before sending another message.`);
    }

    let lastError: any;

    // Retry loop with exponential backoff
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const result = await this.model!.generateContent(message.trim());
        const response = await result.response;
        const text = response.text();

        if (!text || text.trim().length === 0) {
          throw new Error('Received empty response from AI service');
        }

        return text.trim();
      } catch (error: any) {
        lastError = error;
        console.error(`Gemini API call attempt ${attempt + 1} failed:`, error);

        // Don't retry on the last attempt or for non-retryable errors
        if (attempt === this.retryConfig.maxRetries || !this.isRetryableError(error)) {
          break;
        }

        // Wait before retrying
        const delay = this.calculateBackoffDelay(attempt);
        console.log(`Retrying in ${delay}ms...`);
        await this.sleep(delay);
      }
    }

    // Handle the final error
    const chatbotError = parseApiError(lastError);
    throw new Error(this.getErrorMessage(chatbotError));
  }

  /**
   * Get user-friendly error message with cool styling hints
   */
  private getErrorMessage(error: ChatbotError): string {
    switch (error.type) {
      case 'network':
        return "🌐 Oops! Network hiccup detected. Check your connection and let's try again!";
      case 'auth':
        return "🔑 API key seems to be missing or invalid. Please check your configuration!";
      case 'rate_limit':
        return "⏱️ Whoa there! You're chatting too fast. Take a breather and try again in a moment!";
      case 'content':
        return "🚫 That message couldn't be processed. Try rephrasing your question!";
      case 'server':
        return "🤖 AI brain is taking a quick nap. Give it a moment and try again!";
      default:
        return "❓ Something unexpected happened. Don't worry, let's try that again!";
    }
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus(): {
    requestCount: number;
    maxRequests: number;
    windowStart: number;
    isBlocked: boolean;
    blockUntil: number;
  } {
    return {
      requestCount: this.rateLimitState.requestCount,
      maxRequests: this.MAX_REQUESTS_PER_MINUTE,
      windowStart: this.rateLimitState.windowStart,
      isBlocked: this.rateLimitState.isBlocked,
      blockUntil: this.rateLimitState.blockUntil,
    };
  }

  /**
   * Reset rate limiting state (useful for testing)
   */
  resetRateLimit(): void {
    this.rateLimitState = {
      requestCount: 0,
      windowStart: Date.now(),
      isBlocked: false,
      blockUntil: 0,
    };
  }

  /**
   * Check if the service is healthy and can make requests
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isInitialized()) {
        return false;
      }

      // Try a simple test message
      await this.sendMessage('Hello');
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();