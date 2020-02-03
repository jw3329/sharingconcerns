import React, { Fragment, useEffect, useContext, useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../contexts/auth';
import Utils from '../utils';
import TextareaAutoresize from 'react-textarea-autosize';


const Post = () => {

    document.title = 'My posts';

    const { auth } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [create, setCreate] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        let mounted = false;
        axios.get(`/post/user/${auth.username}`)
            .then(res => res.data)
            .then(({ status, posts }) => !mounted && status && setPosts([...posts]))
            .catch(err => console.log(err));
        return () => mounted = true;
    }, [auth.username]);

    const handleChange = e => {
        setCreate({ ...create, [e.target.id]: e.target.value });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const { status, data, message } = (await axios.post('/post', create)).data;
            if (!status) throw new Error(message);
            setPosts([data, ...posts]);
            // reset the input
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
            setCreate({});
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <Fragment>
            <Row>
                <Col sm={6}>
                    <h1>My Post</h1>
                    <div className="posts">
                        {Utils.getPostCards(posts)}
                    </div>
                </Col>
                <Col xs={6}>
                    <div className="create-post">
                        <Form onChange={handleChange} onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Control id="title" placeholder="title" />
                                <TextareaAutoresize id="description" className="mt-2 w-100 p-2" minRows={10} placeholder="description" style={{ resize: 'none' }} />
                            </Form.Group>
                            {message && <div className="alert alert-danger">{message}</div>}
                            <Button type="submit" variant="primary">Make a post</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
}

export default Post;