import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, ProgressBar, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Lesson, Question } from '../types';

const LessonPlayerPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [showResults, setShowResults] = useState(false);
    const [lessonComplete, setLessonComplete] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        if (id) {
            fetchLesson();
        }
    }, [id]);

    const fetchLesson = async () => {
        try {
            setLoading(true);
            const response = await apiService.getLesson(id!);
            setLesson(response.lesson);
            setAnswers(new Array(response.lesson.questions.length).fill(''));
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to load lesson');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (answer: string) => {
        setSelectedAnswer(answer);
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (lesson?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(answers[currentQuestionIndex + 1] || '');
        } else {
            handleCompleteLesson();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedAnswer(answers[currentQuestionIndex - 1] || '');
        }
    };

    const handleCompleteLesson = async () => {
        if (!lesson) return;

        try {
            const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60); // in minutes
            const response = await apiService.completeLesson(lesson._id, answers, timeSpent);
            setResults(response.results);
            setLessonComplete(true);
        } catch (err: any) {
            setError(err.message || 'Failed to complete lesson');
        }
    };

    const getLanguageFlag = (language: string) => {
        const flags: { [key: string]: string } = {
            spanish: '🇪🇸',
            french: '🇫🇷',
            german: '🇩🇪',
            italian: '🇮🇹',
            portuguese: '🇵🇹',
            japanese: '🇯🇵',
            korean: '🇰🇷',
            chinese: '🇨🇳'
        };
        return flags[language] || '🌍';
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return '#10b981';
            case 'intermediate': return '#f59e0b';
            case 'advanced': return '#ef4444';
            default: return '#6b7280';
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading lesson...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <h4>Error Loading Lesson</h4>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => navigate('/play')}>
                        Back to Lessons
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!lesson) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    <h4>Lesson Not Found</h4>
                    <p>The lesson you're looking for doesn't exist or has been removed.</p>
                    <Button variant="outline-warning" onClick={() => navigate('/play')}>
                        Back to Lessons
                    </Button>
                </Alert>
            </Container>
        );
    }

    const currentQuestion = lesson.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <Container>
                {/* Lesson Header */}
                <Row className="mb-4">
                    <Col>
                        <Card style={{ border: 'none', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <Card.Body>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div>
                                        <h2 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
                                            {getLanguageFlag(lesson.language)} {lesson.title}
                                        </h2>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <Badge style={{ backgroundColor: getLevelColor(lesson.level) }}>
                                                {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
                                            </Badge>
                                            <Badge bg="secondary">{lesson.category}</Badge>
                                            <Badge bg="info">⭐ {lesson.xpReward} XP</Badge>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => navigate('/play')}
                                        style={{ borderRadius: '0.5rem' }}
                                    >
                                        ← Back to Lessons
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Progress Bar */}
                <Row className="mb-4">
                    <Col>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '600', color: '#2d3748' }}>
                                Question {currentQuestionIndex + 1} of {lesson.questions.length}
                            </span>
                            <span style={{ color: '#718096' }}>
                                {Math.round(progress)}% Complete
                            </span>
                        </div>
                        <ProgressBar 
                            now={progress} 
                            style={{ height: '8px', borderRadius: '4px' }}
                            variant="success"
                        />
                    </Col>
                </Row>

                {/* Question Card */}
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card style={{ 
                            border: 'none', 
                            borderRadius: '1rem', 
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                            minHeight: '400px'
                        }}>
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <Badge 
                                        style={{ 
                                            backgroundColor: '#6366f1',
                                            fontSize: '0.9rem',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '25px'
                                        }}
                                    >
                                        {currentQuestion.type.replace('-', ' ').toUpperCase()}
                                    </Badge>
                                </div>

                                <h3 style={{ 
                                    textAlign: 'center', 
                                    color: '#2d3748', 
                                    marginBottom: '2rem',
                                    lineHeight: 1.4
                                }}>
                                    {currentQuestion.question}
                                </h3>

                                {/* Multiple Choice Questions */}
                                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                                        {currentQuestion.options.map((option, index) => (
                                            <div key={index} className="mb-3">
                                                <Form.Check
                                                    type="radio"
                                                    id={`option-${index}`}
                                                    name="answer"
                                                    value={option.text}
                                                    checked={selectedAnswer === option.text}
                                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                                    label={
                                                        <div style={{
                                                            padding: '1rem',
                                                            borderRadius: '0.5rem',
                                                            backgroundColor: selectedAnswer === option.text ? '#e0e7ff' : '#f8f9fa',
                                                            border: selectedAnswer === option.text ? '2px solid #6366f1' : '1px solid #e5e7eb',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            width: '100%',
                                                            marginLeft: '1.5rem'
                                                        }}>
                                                            {option.text}
                                                        </div>
                                                    }
                                                    style={{ display: 'none' }}
                                                />
                                                <label 
                                                    htmlFor={`option-${index}`}
                                                    style={{
                                                        display: 'block',
                                                        padding: '1rem',
                                                        borderRadius: '0.5rem',
                                                        backgroundColor: selectedAnswer === option.text ? '#e0e7ff' : '#f8f9fa',
                                                        border: selectedAnswer === option.text ? '2px solid #6366f1' : '1px solid #e5e7eb',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        fontWeight: '500',
                                                        color: '#2d3748'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (selectedAnswer !== option.text) {
                                                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (selectedAnswer !== option.text) {
                                                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                        }
                                                    }}
                                                >
                                                    {option.text}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Fill in the Blank Questions */}
                                {currentQuestion.type === 'fill-blank' && (
                                    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Type your answer here..."
                                                value={selectedAnswer}
                                                onChange={(e) => handleAnswerChange(e.target.value)}
                                                style={{
                                                    padding: '1rem',
                                                    fontSize: '1.1rem',
                                                    borderRadius: '0.5rem',
                                                    border: '2px solid #e5e7eb',
                                                    textAlign: 'center'
                                                }}
                                            />
                                        </Form.Group>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginTop: '3rem',
                                    gap: '1rem'
                                }}>
                                    <Button 
                                        variant="outline-secondary"
                                        onClick={handlePreviousQuestion}
                                        disabled={currentQuestionIndex === 0}
                                        style={{ 
                                            borderRadius: '0.5rem',
                                            padding: '0.75rem 1.5rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        ← Previous
                                    </Button>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096' }}>
                                        <span>💎 {currentQuestion.points} points</span>
                                    </div>

                                    <Button 
                                        variant="primary"
                                        onClick={handleNextQuestion}
                                        disabled={!selectedAnswer.trim()}
                                        style={{ 
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            padding: '0.75rem 1.5rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {currentQuestionIndex === lesson.questions.length - 1 ? 'Complete Lesson' : 'Next →'}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Results Modal */}
                <Modal show={lessonComplete} onHide={() => {}} backdrop="static" centered>
                    <Modal.Body className="text-center p-4">
                        {results && (
                            <>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                    {results.passed ? '🎉' : '💪'}
                                </div>
                                <h3 style={{ 
                                    color: results.passed ? '#10b981' : '#f59e0b',
                                    marginBottom: '1rem'
                                }}>
                                    {results.passed ? 'Congratulations!' : 'Good Effort!'}
                                </h3>
                                <p style={{ fontSize: '1.1rem', color: '#718096', marginBottom: '2rem' }}>
                                    {results.passed 
                                        ? 'You successfully completed the lesson!' 
                                        : 'Keep practicing to improve your score!'}
                                </p>
                                
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(2, 1fr)', 
                                    gap: '1rem',
                                    marginBottom: '2rem'
                                }}>
                                    <div style={{ 
                                        padding: '1rem', 
                                        backgroundColor: '#f8f9fa', 
                                        borderRadius: '0.5rem' 
                                    }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
                                            {results.score}%
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#718096' }}>Score</div>
                                    </div>
                                    <div style={{ 
                                        padding: '1rem', 
                                        backgroundColor: '#f8f9fa', 
                                        borderRadius: '0.5rem' 
                                    }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
                                            {results.correctAnswers}/{results.totalQuestions}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#718096' }}>Correct</div>
                                    </div>
                                    <div style={{ 
                                        padding: '1rem', 
                                        backgroundColor: '#f8f9fa', 
                                        borderRadius: '0.5rem' 
                                    }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6366f1' }}>
                                            +{results.xpEarned}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#718096' }}>XP Earned</div>
                                    </div>
                                    <div style={{ 
                                        padding: '1rem', 
                                        backgroundColor: '#f8f9fa', 
                                        borderRadius: '0.5rem' 
                                    }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
                                            {results.timeSpent || 'N/A'}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#718096' }}>Minutes</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <Button 
                                        variant="outline-primary"
                                        onClick={() => navigate('/play')}
                                        style={{ borderRadius: '0.5rem', fontWeight: '600' }}
                                    >
                                        More Lessons
                                    </Button>
                                    <Button 
                                        variant="primary"
                                        onClick={() => navigate('/dashboard')}
                                        style={{ 
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        View Dashboard
                                    </Button>
                                </div>
                            </>
                        )}
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default LessonPlayerPage;