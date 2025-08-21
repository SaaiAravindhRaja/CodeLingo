import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 text-white" style={{ background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(10px)' }}>
            <Container className="text-center">
                <span>© 2025 CodeLingo. All Rights Reserved.</span>
            </Container>
        </footer>
    );
};

export default Footer;
