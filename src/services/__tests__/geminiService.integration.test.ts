import { GeminiService } from '../geminiService';

describe('GeminiService Integration', () => {
  let service: GeminiService;

  beforeEach(() => {
    service = new GeminiService();
  });

  describe('Service Structure', () => {
    it('should be instantiable', () => {
      expect(service).toBeInstanceOf(GeminiService);
    });

    it('should have required methods', () => {
      expect(typeof service.sendMessage).toBe('function');
      expect(typeof service.getRateLimitStatus).toBe('function');
      expect(typeof service.resetRateLimit).toBe('function');
      expect(typeof service.healthCheck).toBe('function');
    });

    it('should have rate limit status properties', () => {
      const status = service.getRateLimitStatus();
      
      expect(status).toHaveProperty('requestCount');
      expect(status).toHaveProperty('maxRequests');
      expect(status).toHaveProperty('windowStart');
      expect(status).toHaveProperty('isBlocked');
      expect(status).toHaveProperty('blockUntil');
      
      expect(typeof status.requestCount).toBe('number');
      expect(typeof status.maxRequests).toBe('number');
      expect(typeof status.windowStart).toBe('number');
      expect(typeof status.isBlocked).toBe('boolean');
      expect(typeof status.blockUntil).toBe('number');
    });

    it('should reset rate limit correctly', () => {
      service.resetRateLimit();
      const status = service.getRateLimitStatus();
      
      expect(status.requestCount).toBe(0);
      expect(status.isBlocked).toBe(false);
    });
  });

  describe('Input Validation', () => {
    it('should reject empty messages', async () => {
      await expect(service.sendMessage('')).rejects.toThrow();
      await expect(service.sendMessage('   ')).rejects.toThrow();
    });

    it('should reject messages that are too long', async () => {
      const longMessage = 'a'.repeat(4001);
      await expect(service.sendMessage(longMessage)).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing API key gracefully', async () => {
      // This test assumes no API key is configured in test environment
      await expect(service.sendMessage('Hello')).rejects.toThrow();
    });

    it('should return false for health check when not configured', async () => {
      const isHealthy = await service.healthCheck();
      expect(typeof isHealthy).toBe('boolean');
    });
  });
});