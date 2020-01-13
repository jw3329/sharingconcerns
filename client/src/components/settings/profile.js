import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const Profile = () => {

    const handleSubmit = e => {

    }

    const handleChange = e => {

    }


    return (
        <Form onSubmit={handleSubmit} onChange={handleChange}>
            <Row className="justify-content-md-center">
                <Col sm={6}>
                    <Form.Group controlId="firstName">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control type="text" placeholder="Firstname" />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control type="text" placeholder="Lastname" />
                    </Form.Group>
                    <Form.Group controlId="bio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control type="text" placeholder="Bio" />
                    </Form.Group>
                    <Form.Group controlId="url">
                        <Form.Label>URL</Form.Label>
                        <Form.Control type="text" placeholder="url" />
                    </Form.Group>
                    <Form.Group controlId="company">
                        <Form.Label>Company</Form.Label>
                        <Form.Control type="text" placeholder="company" />
                    </Form.Group>
                    <Form.Group controlId="location">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" placeholder="location" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Update</Button>
                    {/* {
                        validation.status !== null && (
                            <Alert className="mt-3" variant={validation.status ? 'success' : 'danger'}>
                                {validation.message}
                            </Alert>
                        )
                    } */}
                </Col>
            </Row>
        </Form>
    );
}

export default Profile;