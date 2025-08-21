import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    return (
        <Container className="mt-5">
            <h1>Create your CodeLingo Account</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <TextField id="username" label="Username" variant="outlined" fullWidth />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <TextField id="email" label="Email" variant="outlined" fullWidth />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <TextField id="password" label="Password" type="password" variant="outlined" fullWidth />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Sign Up
                </Button>
            </Form>
            <div className="mt-3">
                <Link to="/login">Already have an account? Login</Link>
            </div>
        </Container>
    );
};

export default SignupPage;
