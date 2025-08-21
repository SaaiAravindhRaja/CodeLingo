import React from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';

const ProfilePage = () => {
    return (
        <Container className="mt-5">
            <h1>Profile</h1>
            <Card className="mt-4">
                <Card.Body>
                    <Row>
                        <Col md={2}>
                            <img src="https://via.placeholder.com/150" alt="profile" className="rounded-circle" />
                        </Col>
                        <Col md={10}>
                            <h2>User Name</h2>
                            <p>Joined: January 2024</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <h2 className="mt-5">Stats</h2>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Total XP</Card.Title>
                            <Card.Text>5000 XP</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Level</Card.Title>
                            <Card.Text>10</Card.Text>
                            <ProgressBar now={60} label="60%" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Completed Courses</Card.Title>
                            <Card.Text>2</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
