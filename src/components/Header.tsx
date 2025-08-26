import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDisplayName = () => {
        if (user?.profile?.firstName && user?.profile?.lastName) {
            return `${user.profile.firstName} ${user.profile.lastName}`;
        }
        return user?.username || 'User';
    };

    const getAvatarUrl = () => {
        return user?.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=6366f1&color=fff&size=32`;
    };

    return (
        <Navbar expand="lg" variant="light" style={{ 
            backgroundColor: '#ffffff', 
            borderBottom: '1px solid #e5e7eb', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '0.75rem 0'
        }}>
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand style={{ 
                        color: '#1f2937', 
                        fontWeight: 'bold', 
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ 
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            🌍 CodeLingo
                        </span>
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/">
                            <Nav.Link style={{ color: '#374151', fontWeight: '500' }}>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/about">
                            <Nav.Link style={{ color: '#374151', fontWeight: '500' }}>About</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/play">
                            <Nav.Link style={{ 
                                color: '#6366f1', 
                                fontWeight: '600',
                                background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                                borderRadius: '0.5rem',
                                padding: '0.5rem 1rem',
                                margin: '0 0.25rem'
                            }}>
                                🎮 Play
                            </Nav.Link>
                        </LinkContainer>
                        {isAuthenticated && (
                            <LinkContainer to="/dashboard">
                                <Nav.Link style={{ color: '#374151', fontWeight: '500' }}>Dashboard</Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                    <Nav>
                        {isAuthenticated ? (
                            <NavDropdown
                                title={
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Image
                                            src={getAvatarUrl()}
                                            roundedCircle
                                            width={32}
                                            height={32}
                                            alt="Profile"
                                        />
                                        <span style={{ color: '#374151', fontWeight: '500' }}>
                                            {getDisplayName()}
                                        </span>
                                    </div>
                                }
                                id="profile-dropdown"
                                align="end"
                            >
                                <LinkContainer to="/profile">
                                    <NavDropdown.Item>👤 Profile</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/dashboard">
                                    <NavDropdown.Item>📊 Dashboard</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    🚪 Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <LinkContainer to="/login">
                                    <Nav.Link style={{ 
                                        color: '#374151', 
                                        fontWeight: '500',
                                        padding: '0.5rem 1rem'
                                    }}>
                                        Login
                                    </Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/signup">
                                    <Nav.Link style={{ 
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        color: 'white',
                                        fontWeight: '600',
                                        borderRadius: '0.5rem',
                                        padding: '0.5rem 1.5rem',
                                        margin: '0 0.25rem',
                                        border: 'none'
                                    }}>
                                        Sign Up
                                    </Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
