import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
    const teamMembers = [
        {
            name: 'Alex Chen',
            role: 'Founder & CEO',
            avatar: '👨‍💻',
            bio: 'Former Google engineer passionate about making programming education accessible to everyone.'
        },
        {
            name: 'Sarah Johnson',
            role: 'Head of Education',
            avatar: '👩‍🏫',
            bio: 'PhD in Computer Science Education with 10+ years of teaching experience.'
        },
        {
            name: 'Mike Rodriguez',
            role: 'Lead Developer',
            avatar: '👨‍🔬',
            bio: 'Full-stack developer who loves creating engaging learning experiences.'
        },
        {
            name: 'Emily Zhang',
            role: 'UX Designer',
            avatar: '👩‍🎨',
            bio: 'Design expert focused on creating intuitive and beautiful user experiences.'
        }
    ];

    const stats = [
        { number: '50K+', label: 'Active Learners' },
        { number: '100+', label: 'Interactive Lessons' },
        { number: '15+', label: 'Programming Languages' },
        { number: '95%', label: 'Success Rate' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Hero Section */}
            <section style={{ 
                padding: '5rem 0', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textAlign: 'center'
            }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <h1 style={{ 
                                fontSize: '3rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1.5rem'
                            }}>
                                About CodeLingo
                            </h1>
                            <p style={{ 
                                fontSize: '1.25rem', 
                                opacity: 0.9,
                                lineHeight: 1.6
                            }}>
                                We're on a mission to revolutionize programming education by making it 
                                fun, interactive, and accessible to learners worldwide.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Mission Section */}
            <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h2 style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: 'bold', 
                                color: '#2d3748',
                                marginBottom: '1.5rem'
                            }}>
                                Our Mission
                            </h2>
                            <p style={{ 
                                fontSize: '1.1rem', 
                                color: '#718096', 
                                lineHeight: 1.7,
                                marginBottom: '1.5rem'
                            }}>
                                Traditional programming education can be dry and intimidating. We believe 
                                learning to code should be as engaging as playing your favorite game.
                            </p>
                            <p style={{ 
                                fontSize: '1.1rem', 
                                color: '#718096', 
                                lineHeight: 1.7
                            }}>
                                CodeLingo combines gamification, interactive exercises, and real-world 
                                projects to create an immersive learning experience that keeps you 
                                motivated and engaged throughout your coding journey.
                            </p>
                        </Col>
                        <Col lg={6}>
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                borderRadius: '1rem',
                                padding: '3rem',
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
                                <h3 style={{ marginBottom: '1rem' }}>Our Goal</h3>
                                <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
                                    To make programming education accessible, enjoyable, and effective 
                                    for millions of learners around the world.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats Section */}
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
                                CodeLingo by the Numbers
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        {stats.map((stat, index) => (
                            <Col md={6} lg={3} key={index} className="mb-4">
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    backgroundColor: 'white',
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    height: '100%'
                                }}>
                                    <h3 style={{ 
                                        fontSize: '2.5rem', 
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {stat.number}
                                    </h3>
                                    <p style={{ 
                                        color: '#718096', 
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        margin: 0
                                    }}>
                                        {stat.label}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Team Section */}
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
                                Meet Our Team
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: '#718096' }}>
                                Passionate educators and developers working to transform programming education.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        {teamMembers.map((member, index) => (
                            <Col md={6} lg={3} key={index} className="mb-4">
                                <Card style={{ 
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <Card.Body className="text-center p-4">
                                        <div style={{ 
                                            fontSize: '4rem', 
                                            marginBottom: '1rem'
                                        }}>
                                            {member.avatar}
                                        </div>
                                        <Card.Title style={{ 
                                            fontSize: '1.25rem', 
                                            fontWeight: 'bold',
                                            color: '#2d3748',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {member.name}
                                        </Card.Title>
                                        <p style={{ 
                                            color: '#667eea', 
                                            fontWeight: '600',
                                            marginBottom: '1rem'
                                        }}>
                                            {member.role}
                                        </p>
                                        <Card.Text style={{ 
                                            color: '#718096', 
                                            lineHeight: 1.6,
                                            fontSize: '0.9rem'
                                        }}>
                                            {member.bio}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Values Section */}
            <section style={{ 
                padding: '5rem 0', 
                background: 'linear-gradient(135deg, #2d3748, #4a5568)',
                color: 'white'
            }}>
                <Container>
                    <Row className="text-center mb-5">
                        <Col>
                            <h2 style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1rem'
                            }}>
                                Our Values
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} className="mb-4">
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
                                <h4 style={{ marginBottom: '1rem' }}>Excellence</h4>
                                <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
                                    We strive for the highest quality in everything we create, 
                                    from our curriculum to our user experience.
                                </p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                                <h4 style={{ marginBottom: '1rem' }}>Inclusivity</h4>
                                <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
                                    Programming should be accessible to everyone, regardless of 
                                    background, experience, or learning style.
                                </p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                                <h4 style={{ marginBottom: '1rem' }}>Innovation</h4>
                                <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
                                    We continuously explore new ways to make learning more 
                                    engaging, effective, and enjoyable.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default AboutPage;