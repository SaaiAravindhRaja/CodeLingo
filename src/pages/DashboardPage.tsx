import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const DashboardPage = () => {
    return (
        <Container className="mt-5">
            <h1>Dashboard</h1>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Daily Streak</Card.Title>
                            <Card.Text>
                                5 days
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>XP Points</Card.Title>
                            <Card.Text>
                                1200 XP
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Level</Card.Title>
                            <Card.Text>
                                Level 5
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardPage;
