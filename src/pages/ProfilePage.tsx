import React from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';

const ProfilePage = () => {
   
    return (
        
        <Container className="mt-5">
          
            <div className="game-card">
                <Row className="align-items-center">
                    <Col md={2} className="text-center">
                       <img src="../images/profile.png" height="200" className="rounded-circle" alt="Profile" />
                    </Col>
                    <Col md={10}>
                        <h2>Jonathan</h2>
                        <p>Joined: June 2025</p>
                    </Col>
                </Row>
            </div>

            <div className="game-card mt-4">
                <h2 className="mb-4">Stats</h2>
                <Row>
                    <Col>
                        <div className="game-card text-center p-4">
                            <h3>Total XP</h3>
                            <p className="fs-1">0</p>
                        </div>
                    </Col>
                    <Col>
                        <div className="game-card text-center p-4">
                            <h3>Level</h3>
                            <p className="fs-1">0</p>
                            <ProgressBar now={60} label="60%" />
                        </div>
                    </Col>
                    <Col>
                        <div className="game-card text-center p-4">
                            <h3>Courses Completed</h3>
                            <p className="fs-1">0</p>
                        </div>
                    </Col>
                </Row>
            </div>

           
            <button className="btn btn-primary select">Select a course</button>
            <button className="btn btn-primary recommended">View course status</button>
           
        </Container>
    );
};

export default ProfilePage;
