import React, { Fragment, useEffect, useContext, useState } from 'react';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../contexts/auth';


const Post = () => {

    const { auth } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [create, setCreate] = useState({});

    useEffect(() => {
        axios.get(`/post/user/${auth.username}`)
            .then(res => res.data)
            .then(({ posts }) => console.log(posts) && setPosts(posts.map((post, key) => generatePostCard(post, key))))
            .catch(err => console.log(err));
    }, []);

    const generatePostCard = (post, key) => (
        <Card style={{ width: '20rem' }} key={key}>
            <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>
                    {post.description}
                </Card.Text>
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
                        {posts}
                    </div>
                </Col>
                <Col xs={6}>
                    <div className="create-post">
                        <Form onChange={handleChange} onSubmit={handleSubmit}>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
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