import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { withRouter } from 'react-router';
import AuthContext from '../../contexts/auth';

const Signin = ({ history }) => {

    document.title = 'Sign in';
    const [form, setForm] = useState({});
    const [message, setMessage] = useState('');
    const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        if (auth) return history.replace('/');
    }, [auth, history]);


    const handleSubmit = async e => {
        e.preventDefault();
        // handle if password and confirm password does not match
        try {
            const { status, user, message } = (await axios.post('/user/authorize', form)).data;
            if (!status) setMessage(message);
            setAuth(user);
        } catch (error) {
            console.log(error);
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
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                    {
                        message && (
                            <Alert className="mt-3" variant="danger">
                                {message}
                            </Alert>
                        )
                    }
                </Col>
            </Row>
        </Form>
    );
}

export default withRouter(Signin);