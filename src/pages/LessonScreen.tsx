import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const LessonScreen = () => {
    const { courseId } = useParams();

    return (
        <Container className="mt-5">
            <h1>Lesson: {courseId}</h1>
            <Row className="mt-4">
                <Col md={8}>
                    <div className="lesson-content">
                        <h2>Question: What is a variable?</h2>
                        <p>In programming, a variable is a value that can change, depending on conditions or on information passed to the program. </p>
                        <textarea className="form-control" rows={5} placeholder="Write your code here..."></textarea>
                    </div>
                </Col>
                <Col md={4}>
                    <h3>Instructions</h3>
                    <p>Declare a variable named 'myVar' and assign it the value 10.</p>
                </Col>
            </Row>
            <Button variant="primary" className="mt-4">Check Answer</Button>
        </Container>
    );
};

export default LessonScreen;
