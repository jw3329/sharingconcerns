import React, { useState, useContext } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import AuthContext from '../../contexts/auth';
import axios from 'axios';

const Profile = () => {

    const { auth, setAuth } = useContext(AuthContext);
    const [profileForm, setProfileForm] = useState({});
    const [message, setMessage] = useState({});

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage({});
        const { status, user, message } = (await axios.put(`/user/${auth._id}`, profileForm)).data;
        setMessage({ status, message });
        setAuth(user);
    }

    const handleChange = e => {
        setProfileForm({
            ...profileForm,
            [e.target.id]: e.target.value
        });
    }

    return (
        <Form onSubmit={handleSubmit} onChange={handleChange}>
            <Row className="justify-content-md-center">
                <Col sm={6}>
                    <Form.Group controlId="firstName">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control type="text" placeholder="Firstname" defaultValue={auth.firstName} />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control type="text" placeholder="Lastname" defaultValue={auth.lastName} />
                    </Form.Group>
                    <Form.Group controlId="bio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control type="text" placeholder="Bio" defaultValue={auth.bio} />
                    </Form.Group>
                    <Form.Group controlId="url">
                        <Form.Label>URL</Form.Label>
                        <Form.Control type="text" placeholder="URL" defaultValue={auth.url} />
                    </Form.Group>
                    <Form.Group controlId="company">
                        <Form.Label>Company</Form.Label>
                        <Form.Control type="text" placeholder="Company" defaultValue={auth.company} />
                    </Form.Group>
                    <Form.Group controlId="location">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" placeholder="Location" defaultValue={auth.location} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Update</Button>
                    {
                        message.status !== undefined && (
                            <Alert className="mt-3" variant={message.status ? 'success' : 'danger'}>
                                {message.message}
                            </Alert>
                        )
                    }
                </Col>
            </Row>
        </Form>
    );
}

export default Profile;