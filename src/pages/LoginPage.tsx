import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="glass-container" style={{ width: '400px' }}>
                <h1 className="text-center mb-4">Login to CodeLingo</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <TextField id="email" label="Email" variant="filled" fullWidth 
                            InputLabelProps={{ style: { color: '#fff' } }} 
                            inputProps={{ style: { color: '#fff' } }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <TextField id="password" label="Password" type="password" variant="filled" fullWidth 
                            InputLabelProps={{ style: { color: '#fff' } }}
                            inputProps={{ style: { color: '#fff' } }}
                        />
                    </Form.Group>
                    <div className="d-grid">
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </div>
                </Form>
                <div className="mt-3 text-center">
                    <Link to="/signup" style={{ color: '#fff' }}>Don't have an account? Sign Up</Link>
                </div>
            </div>
        </Container>
    );
};

export default LoginPage;
