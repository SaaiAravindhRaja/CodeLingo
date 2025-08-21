import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CourseSelectionPage = () => {
    const courses = ['Python', 'JavaScript', 'Java', 'C++', 'C'];

    return (
        <Container className="mt-5">
            <h1>Select a Course</h1>
            <Row className="mt-4">
                {courses.map(course => (
                    <Col md={4} className="mb-4" key={course}>
                        <Card as={Link} to={`/lessons/${course.toLowerCase()}`} className="text-decoration-none">
                            <Card.Body>
                                <Card.Title>{course}</Card.Title>
                                <Card.Text>
                                    Learn the fundamentals of {course}.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CourseSelectionPage;
