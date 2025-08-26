import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }

        // Real-time password confirmation validation
        if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
            const password = name === 'password' ? value : formData.password;
            const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
            
            if (confirmPassword && password !== confirmPassword) {
                setErrors({
                    ...errors,
                    confirmPassword: 'Passwords do not match'
                });
            } else {
                setErrors({
                    ...errors,
                    confirmPassword: ''
                });
            }
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            setSuccess(true);
            
            // Redirect to login page after successful registration
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Account created successfully! Please sign in with your credentials.' 
                    }
                });
            }, 2000);
            
        } catch (err: any) {
            setErrors({
                general: err.message || 'Registration failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Card style={{ 
                    maxWidth: '400px',
                    border: 'none',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center'
                }}>
                    <Card.Body style={{ padding: '3rem 2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Account Created!</h3>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            Welcome to CodeLingo! Redirecting you to the login page...
                        </p>
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }

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
                        maxWidth: '450px',
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
                                🚀 Join CodeLingo
                            </h2>
                            <p style={{ 
                                margin: '0.5rem 0 0 0', 
                                opacity: 0.9,
                                fontSize: '1rem'
                            }}>
                                Start your coding journey today
                            </p>
                        </div>

                        <Card.Body style={{ padding: '2rem' }}>
                            {errors.general && (
                                <Alert variant="danger" style={{ 
                                    borderRadius: '0.5rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {errors.general}
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
                                        placeholder="Choose a username"
                                        isInvalid={!!errors.username}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: errors.username ? '2px solid #dc3545' : '2px solid #e5e7eb',
                                            fontSize: '1rem'
                                        }}
                                        disabled={loading}
                                    />
                                    {errors.username && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label style={{ 
                                        fontWeight: '600', 
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Email Address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        isInvalid={!!errors.email}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: errors.email ? '2px solid #dc3545' : '2px solid #e5e7eb',
                                            fontSize: '1rem'
                                        }}
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
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
                                        placeholder="Create a password"
                                        isInvalid={!!errors.password}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: errors.password ? '2px solid #dc3545' : '2px solid #e5e7eb',
                                            fontSize: '1rem'
                                        }}
                                        disabled={loading}
                                    />
                                    {errors.password && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label style={{ 
                                        fontWeight: '600', 
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Confirm Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        isInvalid={!!errors.confirmPassword}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: errors.confirmPassword ? '2px solid #dc3545' : 
                                                   (formData.confirmPassword && formData.password === formData.confirmPassword ? '2px solid #10b981' : '2px solid #e5e7eb'),
                                            fontSize: '1rem'
                                        }}
                                        disabled={loading}
                                    />
                                    {errors.confirmPassword && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.confirmPassword}
                                        </Form.Control.Feedback>
                                    )}
                                    {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                                        <div style={{ color: '#10b981', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                            ✓ Passwords match
                                        </div>
                                    )}
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
                                            Creating Account...
                                        </>
                                    ) : (
                                        '🎯 Create Account'
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
                                    Already have an account?
                                </p>
                                <Link 
                                    to="/login" 
                                    style={{
                                        color: '#6366f1',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Sign In →
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default SignupPage;
