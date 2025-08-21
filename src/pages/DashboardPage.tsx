import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const DashboardPage = () => {
    return (
        <Container className="mt-5">
            <div className="game-card">
                <h1 className="mb-4">Dashboard</h1>
                <Row>
                    <Col md={4}>
                        <div className="game-card text-center p-4">
                            <h3>Daily Streak</h3>
                            <p className="fs-1">5</p>
                            <p>days</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="game-card text-center p-4">
                            <h3>XP Points</h3>
                            <p className="fs-1">1200</p>
                            <p>XP</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="game-card text-center p-4">
                            <h3>Level</h3>
                            <p className="fs-1">5</p>
                            <p>Beginner</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default DashboardPage;
