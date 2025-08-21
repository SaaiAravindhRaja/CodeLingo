import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 text-white" style={{ backgroundColor: 'var(--ray-bg-medium)', borderTop: '1px solid var(--ray-border-light)' }}>
            <Container className="text-center">
                <span>© 2025 CodeLingo. All Rights Reserved.</span>
            </Container>
        </footer>
    );
};

export default Footer;
