import React, { Fragment, useEffect, useContext, useState } from 'react';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../contexts/auth';
import { Link } from 'react-router-dom';
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

    const generatePostCard = (post, key) => (
        <Card style={{ width: '30rem' }} key={key}>
            <Card.Body>
                <div className="row">
                    <div className="col-sm-3">
                        {Utils.getImageElement(post.user._id, post.user.profileImage)}
                    </div>
                    <div className="col-sm-6">
                        <Card.Title> <Link to={`/post/${post._id}`}>{post.title}</Link></Card.Title>
                    </div>
                    <div className="col-sm-3" style={{ fontSize: "smaller" }}>
                        <div>{`${post.views} views`}</div>
                        <div>{post.user.username}</div>
                        <div>{Utils.toLocaleTimestamp(post.updateDate)}</div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )

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
                        {posts.map((post, key) => generatePostCard(post, key))}
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