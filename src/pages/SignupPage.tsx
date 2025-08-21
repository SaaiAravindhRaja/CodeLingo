import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 112px)' }}>
            <div className="game-card" style={{ width: '400px' }}>
                <h1 className="text-center mb-4">Create your Account</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <TextField id="username" label="Username" variant="filled" fullWidth
                            InputLabelProps={{ style: { color: 'var(--ray-text-dark)' } }}
                            inputProps={{ style: { color: 'var(--ray-text-light)' } }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <TextField id="email" label="Email" variant="filled" fullWidth
                            InputLabelProps={{ style: { color: 'var(--ray-text-dark)' } }}
                            inputProps={{ style: { color: 'var(--ray-text-light)' } }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <TextField id="password" label="Password" type="password" variant="filled" fullWidth />
                    </Form.Group>
                    <div className="d-grid">
                        <Button variant="primary" type="submit">
                            Sign Up
                        </Button>
                    </div>
                </Form>
                <div className="mt-3 text-center">
                    <Link to="/login">Already have an account? Login</Link>
                </div>
            </div>
        </Container>
    );
};

export default SignupPage;
