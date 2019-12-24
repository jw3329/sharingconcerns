import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const Signup = () => {

    document.title = 'Sign up';

    const [form, setForm] = useState({});
    const [validation, setValidation] = useState({ status: null, message: '' });

    const handleSubmit = async e => {
        e.preventDefault();
        // removes message first
        setValidation({ status: null, message: '' });
        // handle if password and confirm password does not match
        try {
            const response = await axios.post('/user/signup', form);
            setValidation({
                status: true,
                message: response.data.message
            });
        } catch (error) {
            setValidation({
                status: false,
                message: error.response.data.message
            });
        }
    }

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    }

    return (
        <Form onSubmit={handleSubmit} onChange={handleChange}>
            <Row className="justify-content-md-center">
                <Col sm={6}>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                    </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm password" />
                    </Form.Group>
                    <Form.Group controlId="firstName">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control type="text" placeholder="Firstname" />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control type="text" placeholder="Lastname" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                    {
                        validation.status !== null && (
                            <Alert className="mt-3" variant={validation.status ? 'success' : 'danger'}>
                                {validation.message}
                            </Alert>
                        )
                    }
                </Col>
            </Row>
        </Form>
    );
}

export default Signup;