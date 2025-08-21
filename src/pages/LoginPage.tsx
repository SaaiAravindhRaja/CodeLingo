import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <Container className="mt-5">
            <h1>Login to CodeLingo</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <TextField id="email" label="Email" variant="outlined" fullWidth />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <TextField id="password" label="Password" type="password" variant="outlined" fullWidth />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
            <div className="mt-3">
                <Link to="/signup">Don't have an account? Sign Up</Link>
            </div>
        </Container>
    );
};

export default LoginPage;
