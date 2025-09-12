import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const CoursePage = () => {
    const { isAuthenticated } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const [selectedLevel, setSelectedLevel] = useState<string>('all');

    const languages = [
        { id: 'all', name: 'All Languages', icon: '🌍', color: '#6366f1' },
        { id: 'python', name: 'Python', icon: '🐍', color: '#3776ab' },
        { id: 'javascript', name: 'JavaScript', icon: '⚡', color: '#f7df1e' },
        { id: 'java', name: 'Java', icon: '☕', color: '#ed8b00' },
        { id: 'cpp', name: 'C++', icon: '⚙️', color: '#00599c' },
        { id: 'csharp', name: 'C#', icon: '🔷', color: '#239120' },
        { id: 'go', name: 'Go', icon: '🐹', color: '#00add8' },
        { id: 'rust', name: 'Rust', icon: '🦀', color: '#000000' },
        { id: 'swift', name: 'Swift', icon: '🍎', color: '#fa7343' },
        { id: 'kotlin', name: 'Kotlin', icon: '🎯', color: '#7f52ff' },
        { id: 'php', name: 'PHP', icon: '🐘', color: '#777bb4' },
        { id: 'ruby', name: 'Ruby', icon: '💎', color: '#cc342d' },
        { id: 'typescript', name: 'TypeScript', icon: '📘', color: '#3178c6' }
    ];

    const levels = [
        { id: 'all', name: 'All Levels', color: '#6b7280' },
        { id: 'beginner', name: 'Beginner', color: '#10b981' },
        { id: 'intermediate', name: 'Intermediate', color: '#f59e0b' },
        { id: 'advanced', name: 'Advanced', color: '#ef4444' }
    ];

    useEffect(() => {
        fetchCourses();
    }, [selectedLanguage, selectedLevel]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (selectedLanguage !== 'all') params.language = selectedLanguage;
            if (selectedLevel !== 'all') params.level = selectedLevel;
            
            const response = await apiService.getCourses(params);
            setCourses(response.courses || []);
            setError(null);
        } catch (err) {
            setError('Failed to load courses. Please try again.');
            console.error('Error fetching courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return '#10b981';
            case 'intermediate': return '#f59e0b';
            case 'advanced': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getLanguageInfo = (langId: string) => {
        return languages.find(lang => lang.id === langId) || languages[0];
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <Container>
                {/* Header */}
                <Row className="mb-5">
                    <Col className="text-center">
                        <h1 style={{ 
                            fontSize: '3rem', 
                            fontWeight: 'bold', 
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '1rem'
                        }}>
                            💻 Programming Courses
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#718096', maxWidth: '600px', margin: '0 auto' }}>
                            Master programming languages with structured courses, hands-on projects, and interactive quizzes!
                        </p>
                    </Col>
                </Row>

                {/* Language Filter */}
                <Row className="mb-4">
                    <Col>
                        <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Programming Languages</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {languages.map((lang) => (
                                <Button
                                    key={lang.id}
                                    variant={selectedLanguage === lang.id ? 'primary' : 'outline-secondary'}
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    style={{
                                        borderRadius: '25px',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        ...(selectedLanguage === lang.id && {
                                            backgroundColor: lang.color,
                                            borderColor: lang.color
                                        })
                                    }}
                                >
                                    {lang.icon} {lang.name}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Level Filter */}
                <Row className="mb-4">
                    <Col>
                        <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Difficulty Level</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {levels.map((level) => (
                                <Button
                                    key={level.id}
                                    variant={selectedLevel === level.id ? 'primary' : 'outline-secondary'}
                                    onClick={() => setSelectedLevel(level.id)}
                                    style={{
                                        borderRadius: '25px',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        ...(selectedLevel === level.id && {
                                            backgroundColor: level.color,
                                            borderColor: level.color
                                        })
                                    }}
                                >
                                    {level.name}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Loading State */}
                {loading && (
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Loading courses...</p>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* Error State */}
                {error && (
                    <Row>
                        <Col>
                            <Alert variant="danger">
                                {error}
                            </Alert>
                        </Col>
                    </Row>
                )}

                {/* Courses Grid */}
                {!loading && !error && (
                    <>
                        <Row className="mb-3">
                            <Col>
                                <h4 style={{ color: '#2d3748' }}>
                                    Available Courses ({courses.length})
                                </h4>
                            </Col>
                        </Row>
                        <Row>
                            {courses.length === 0 ? (
                                <Col className="text-center">
                                    <div style={{ padding: '3rem', color: '#718096' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                                        <h4>No courses found</h4>
                                        <p>Try adjusting your filters or check back later for new content.</p>
                                    </div>
                                </Col>
                            ) : (
                                courses.map((course) => {
                                    const langInfo = getLanguageInfo(course.language);
                                    return (
                                        <Col md={6} lg={4} key={course._id} className="mb-4">
                                            <Card style={{ 
                                                height: '100%',
                                                border: 'none',
                                                borderRadius: '1rem',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                overflow: 'hidden'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                            }}>
                                                {/* Card Header */}
                                                <div style={{
                                                    background: `linear-gradient(135deg, ${langInfo.color}, ${langInfo.color}dd)`,
                                                    color: 'white',
                                                    padding: '1.5rem',
                                                    textAlign: 'center'
                                                }}>
                                                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                                                        {langInfo.icon}
                                                    </div>
                                                    <Badge 
                                                        style={{ 
                                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                                            color: 'white',
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        {course.language.charAt(0).toUpperCase() + course.language.slice(1)}
                                                    </Badge>
                                                </div>

                                                <Card.Body className="d-flex flex-column">
                                                    <div className="mb-2">
                                                        <Badge 
                                                            style={{ 
                                                                backgroundColor: getLevelColor(course.level),
                                                                marginRight: '0.5rem'
                                                            }}
                                                        >
                                                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                                        </Badge>
                                                        <Badge bg="info">
                                                            {course.sections?.length || 0} Sections
                                                        </Badge>
                                                    </div>
                                                    
                                                    <Card.Title style={{ 
                                                        fontSize: '1.1rem', 
                                                        fontWeight: 'bold',
                                                        color: '#2d3748',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        {course.title}
                                                    </Card.Title>
                                                    
                                                    <Card.Text style={{ 
                                                        color: '#718096', 
                                                        fontSize: '0.9rem',
                                                        lineHeight: 1.5,
                                                        flex: 1
                                                    }}>
                                                        {course.description}
                                                    </Card.Text>

                                                    <div style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center',
                                                        marginTop: '1rem',
                                                        fontSize: '0.8rem',
                                                        color: '#718096'
                                                    }}>
                                                        <span>⏱️ {course.estimatedHours}h</span>
                                                        <span>⭐ {course.totalXP} XP</span>
                                                    </div>

                                                    {course.userProgress?.enrolled && (
                                                        <div style={{ 
                                                            marginTop: '0.5rem',
                                                            padding: '0.5rem',
                                                            backgroundColor: course.userProgress.progress === 100 ? '#f0fdf4' : '#eff6ff',
                                                            borderRadius: '0.5rem',
                                                            textAlign: 'center',
                                                            fontSize: '0.8rem',
                                                            color: course.userProgress.progress === 100 ? '#166534' : '#1d4ed8'
                                                        }}>
                                                            {course.userProgress.progress === 100 ? '🎉 Completed!' : `📚 ${course.userProgress.progress}% Complete`}
                                                        </div>
                                                    )}

                                                    <div className="mt-3">
                                                        {isAuthenticated ? (
                                                            <LinkContainer to={`/course/${course._id}`}>
                                                                <Button 
                                                                    style={{
                                                                        width: '100%',
                                                                        background: `linear-gradient(135deg, ${langInfo.color}, ${langInfo.color}dd)`,
                                                                        border: 'none',
                                                                        borderRadius: '0.5rem',
                                                                        fontWeight: '600'
                                                                    }}
                                                                >
                                                                    {course.userProgress?.enrolled ? 
                                                                        (course.userProgress.progress === 100 ? '🔄 Review Course' : '📖 Continue Learning') 
                                                                        : '🚀 Start Course'}
                                                                </Button>
                                                            </LinkContainer>
                                                        ) : (
                                                            <LinkContainer to="/login">
                                                                <Button 
                                                                    variant="outline-primary"
                                                                    style={{
                                                                        width: '100%',
                                                                        borderRadius: '0.5rem',
                                                                        fontWeight: '600'
                                                                    }}
                                                                >
                                                                    🔐 Login to Start
                                                                </Button>
                                                            </LinkContainer>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })
                            )}
                        </Row>
                    </>
                )}

                {/* Call to Action for Non-authenticated Users */}
                {!isAuthenticated && (
                    <Row className="mt-5">
                        <Col>
                            <Card style={{
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '1rem',
                                textAlign: 'center'
                            }}>
                                <Card.Body className="p-4">
                                    <h4 style={{ marginBottom: '1rem' }}>Ready to Start Coding?</h4>
                                    <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
                                        Join thousands of developers learning to code with our structured courses and interactive projects!
                                    </p>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <LinkContainer to="/signup">
                                            <Button 
                                                variant="light" 
                                                size="lg"
                                                style={{ 
                                                    fontWeight: '600',
                                                    borderRadius: '0.5rem'
                                                }}
                                            >
                                                🎯 Sign Up Free
                                            </Button>
                                        </LinkContainer>
                                        <LinkContainer to="/login">
                                            <Button 
                                                variant="outline-light" 
                                                size="lg"
                                                style={{ 
                                                    fontWeight: '600',
                                                    borderRadius: '0.5rem'
                                                }}
                                            >
                                                Login
                                            </Button>
                                        </LinkContainer>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default CoursePage;