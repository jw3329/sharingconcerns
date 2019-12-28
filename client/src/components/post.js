import React, { Fragment, useEffect, useContext, useState } from 'react';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../contexts/auth';
import { Link } from 'react-router-dom';


const Post = () => {

    const { auth } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [create, setCreate] = useState({});

    useEffect(() => {
        let mounted = false;
        axios.get(`/post/user/${auth.username}`)
            .then(res => res.data)
            .then(({ status, posts }) => !mounted && status && setPosts([...posts]))
            .catch(err => console.log(err));
        return () => mounted = true;
    }, [auth.username]);

    const generatePostCard = (post, key) => (
        <Card style={{ width: '20rem' }} key={key}>
            <Card.Body>
                <Card.Title> <Link to={`/post/${post._id}`}>{post.title}</Link></Card.Title>
                <div className="d-flex justify-content-end" style={{ fontSize: "smaller" }}>{`${new Date(post.updateDate).toLocaleDateString()} ${new Date(post.updateDate).toLocaleTimeString()}`}</div>
            </Card.Body>
        </Card>
    )

    const handleChange = e => {
        setCreate({ ...create, [e.target.id]: e.target.value });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const { data } = (await axios.post('/post', create)).data;
        setPosts([data, ...posts]);
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
                                <Form.Control className="mt-2" id="description" as="textarea" rows="10" placeholder="description" />
                            </Form.Group>
                            <Button type="submit" variant="primary">Make a post</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
}

export default Post;