import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Check for success message from signup
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the message from location state
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error and success message when user starts typing
        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.username.trim() || !formData.password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login({
                login: formData.username, // Backend accepts username or email in 'login' field
                password: formData.password
            });
            navigate('/'); // Redirect to home page on successful login
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0'
        }}>
            <Container>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    minHeight: '70vh'
                }}>
                    <Card style={{ 
                        width: '100%', 
                        maxWidth: '400px',
                        border: 'none',
                        borderRadius: '1rem',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white',
                            padding: '2rem',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ 
                                margin: 0, 
                                fontWeight: 'bold',
                                fontSize: '1.8rem'
                            }}>
                                🌍 Welcome Back
                            </h2>
                            <p style={{ 
                                margin: '0.5rem 0 0 0', 
                                opacity: 0.9,
                                fontSize: '1rem'
                            }}>
                                Sign in to continue learning
                            </p>
                        </div>

                        <Card.Body style={{ padding: '2rem' }}>
                            {successMessage && (
                                <Alert variant="success" style={{ 
                                    borderRadius: '0.5rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {successMessage}
                                </Alert>
                            )}
                            
                            {error && (
                                <Alert variant="danger" style={{ 
                                    borderRadius: '0.5rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ 
                                        fontWeight: '600', 
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Username
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '2px solid #e5e7eb',
                                            fontSize: '1rem'
                                        }}
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label style={{ 
                                        fontWeight: '600', 
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '2px solid #e5e7eb',
                                            fontSize: '1rem'
                                        }}
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        marginBottom: '1.5rem'
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Signing In...
                                        </>
                                    ) : (
                                        '🚀 Sign In'
                                    )}
                                </Button>
                            </Form>

                            <div style={{ 
                                textAlign: 'center',
                                padding: '1rem 0',
                                borderTop: '1px solid #e5e7eb'
                            }}>
                                <p style={{ 
                                    color: '#6b7280', 
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '0.9rem'
                                }}>
                                    Don't have an account?
                                </p>
                                <Link 
                                    to="/signup" 
                                    style={{
                                        color: '#6366f1',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Create Account →
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default LoginPage;
