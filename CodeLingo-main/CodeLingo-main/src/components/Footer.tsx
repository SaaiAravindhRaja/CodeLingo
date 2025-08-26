import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3" style={{ backgroundColor: 'var(--game-card-bg)', borderTop: '1px solid var(--game-border-light)', boxShadow: '0 -2px 5px var(--game-shadow)', color: 'var(--game-text-dark)' }}>
            <Container className="text-center">
                <span>© 2025 CodeLingo. All Rights Reserved.</span>
            </Container>
        </footer>
    );
};

export default Footer;
