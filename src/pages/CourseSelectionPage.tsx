import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CourseSelectionPage = () => {
    const courses = ['Python', 'JavaScript', 'Java', 'C++', 'C'];

    return (
        <Container className="mt-5">
            <div className="glass-container">
                <h1 className="mb-4 text-center">Select a Course</h1>
                <Row>
                    {courses.map(course => (
                        <Col md={4} className="mb-4" key={course}>
                            <Link to={`/lessons/${course.toLowerCase()}`} className="text-decoration-none">
                                <div className="glass-container text-center p-4 h-100">
                                    <h3>{course}</h3>
                                    <p>Learn the fundamentals of {course}.</p>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
};

export default CourseSelectionPage;
