import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
    return (
        <Navbar expand="lg" variant="light" style={{ backgroundColor: 'var(--game-card-bg)', borderBottom: '1px solid var(--game-border-light)', boxShadow: '0 2px 5px var(--game-shadow)' }}>
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand style={{ color: 'var(--game-text-dark)', fontWeight: 'bold' }}>CodeLingo</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/dashboard">
                            <Nav.Link style={{ color: 'var(--game-text-dark)' }}>Dashboard</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/courses">
                            <Nav.Link style={{ color: 'var(--game-text-dark)' }}>Courses</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/profile">
                            <Nav.Link style={{ color: 'var(--game-text-dark)' }}>Profile</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <Nav>
                        <LinkContainer to="/login">
                            <Nav.Link style={{ color: 'var(--game-text-dark)' }}>Login</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/signup">
                            <Nav.Link style={{ color: 'var(--game-text-dark)' }}>Sign Up</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
