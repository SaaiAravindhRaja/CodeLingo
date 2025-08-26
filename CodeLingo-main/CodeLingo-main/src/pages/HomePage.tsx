import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: '🎮',
            title: 'Interactive Learning',
            description: 'Learn programming languages through engaging games and interactive exercises.'
        },
        {
            icon: '🏆',
            title: 'Progress Tracking',
            description: 'Track your learning journey with XP points, levels, and achievement badges.'
        },
        {
            icon: '🌍',
            title: 'Multiple Languages',
            description: 'Master various programming languages from Python to JavaScript and beyond.'
        },
        {
            icon: '👥',
            title: 'Community',
            description: 'Join a community of learners and compete on global leaderboards.'
        }
    ];

    const languages = [
        { name: 'Python', icon: '🐍', color: '#3776ab' },
        { name: 'JavaScript', icon: '⚡', color: '#f7df1e' },
        { name: 'Java', icon: '☕', color: '#ed8b00' },
        { name: 'C++', icon: '⚙️', color: '#00599c' },
        { name: 'React', icon: '⚛️', color: '#61dafb' },
        { name: 'Node.js', icon: '🟢', color: '#339933' }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            {/* Hero Section */}
            <section style={{ 
                padding: '5rem 0', 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                color: 'white',
                textAlign: 'center'
            }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <h1 style={{ 
                                fontSize: '3.5rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1.5rem',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                Master Programming Through Play
                            </h1>
                            <p style={{ 
                                fontSize: '1.25rem', 
                                marginBottom: '2rem',
                                opacity: 0.9,
                                lineHeight: 1.6
                            }}>
                                CodeLingo transforms learning programming languages into an engaging, 
                                game-like experience. Level up your coding skills with interactive lessons, 
                                challenges, and real-world projects.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <LinkContainer to="/play">
                                    <Button 
                                        size="lg" 
                                        style={{ 
                                            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                                            border: 'none',
                                            padding: '0.75rem 2rem',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            borderRadius: '50px',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        🚀 Start Playing Now
                                    </Button>
                                </LinkContainer>
                                {!isAuthenticated && (
                                    <LinkContainer to="/signup">
                                        <Button 
                                            variant="outline-light" 
                                            size="lg"
                                            style={{ 
                                                padding: '0.75rem 2rem',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                borderRadius: '50px',
                                                borderWidth: '2px'
                                            }}
                                        >
                                            Join Free
                                        </Button>
                                    </LinkContainer>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f8f9fa' }}>
                <Container>
                    <Row className="text-center mb-5">
                        <Col>
                            <h2 style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: 'bold', 
                                color: '#2d3748',
                                marginBottom: '1rem'
                            }}>
                                Why Choose CodeLingo?
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: '#718096', maxWidth: '600px', margin: '0 auto' }}>
                                We've reimagined how programming should be learned - making it fun, engaging, and effective.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        {features.map((feature, index) => (
                            <Col md={6} lg={3} key={index} className="mb-4">
                                <Card style={{ 
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                }}>
                                    <Card.Body className="text-center p-4">
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                            {feature.icon}
                                        </div>
                                        <Card.Title style={{ 
                                            fontSize: '1.25rem', 
                                            fontWeight: 'bold',
                                            color: '#2d3748',
                                            marginBottom: '1rem'
                                        }}>
                                            {feature.title}
                                        </Card.Title>
                                        <Card.Text style={{ color: '#718096', lineHeight: 1.6 }}>
                                            {feature.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Languages Section */}
            <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
                <Container>
                    <Row className="text-center mb-5">
                        <Col>
                            <h2 style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: 'bold', 
                                color: '#2d3748',
                                marginBottom: '1rem'
                            }}>
                                Learn Popular Programming Languages
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: '#718096' }}>
                                From beginner-friendly Python to advanced frameworks, we've got you covered.
                            </p>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        {languages.map((lang, index) => (
                            <Col xs={6} md={4} lg={2} key={index} className="mb-4">
                                <div style={{
                                    textAlign: 'center',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                        {lang.icon}
                                    </div>
                                    <h5 style={{ 
                                        color: lang.color, 
                                        fontWeight: 'bold',
                                        margin: 0
                                    }}>
                                        {lang.name}
                                    </h5>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section style={{ 
                padding: '5rem 0', 
                background: 'linear-gradient(135deg, #2d3748, #4a5568)',
                color: 'white',
                textAlign: 'center'
            }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <h2 style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1.5rem'
                            }}>
                                Ready to Start Your Coding Journey?
                            </h2>
                            <p style={{ 
                                fontSize: '1.1rem', 
                                marginBottom: '2rem',
                                opacity: 0.9
                            }}>
                                Join thousands of developers who are already learning and growing with CodeLingo.
                            </p>
                            <LinkContainer to="/play">
                                <Button 
                                    size="lg" 
                                    style={{ 
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        border: 'none',
                                        padding: '1rem 3rem',
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        borderRadius: '50px',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    🎮 Start Learning Today
                                </Button>
                            </LinkContainer>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default HomePage;