import React from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';

const ProfilePage = () => {
    return (
        <Container className="mt-5">
            <div className="glass-container">
                <Row className="align-items-center">
                    <Col md={2} className="text-center">
                        <img src="https://via.placeholder.com/150" alt="profile" className="rounded-circle" />
                    </Col>
                    <Col md={10}>
                        <h2>User Name</h2>
                        <p>Joined: January 2024</p>
                    </Col>
                </Row>
            </div>

            <div className="glass-container mt-4">
                <h2 className="mb-4">Stats</h2>
                <Row>
                    <Col>
                        <div className="glass-container text-center p-4">
                            <h3>Total XP</h3>
                            <p className="fs-1">5000</p>
                        </div>
                    </Col>
                    <Col>
                        <div className="glass-container text-center p-4">
                            <h3>Level</h3>
                            <p className="fs-1">10</p>
                            <ProgressBar now={60} label="60%" />
                        </div>
                    </Col>
                    <Col>
                        <div className="glass-container text-center p-4">
                            <h3>Courses Completed</h3>
                            <p className="fs-1">2</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default ProfilePage;
