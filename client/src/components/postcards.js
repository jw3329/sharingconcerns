import React from 'react';
import { Card } from 'react-bootstrap';
import Utils from '../utils';
import { Link } from 'react-router-dom';

const PostCards = ({ posts }) => {

    const generatePostCard = (post, key) => (
        <Card style={{ width: '30rem' }} key={key}>
            <Card.Body>
                <div className="row">
                    <div className="col-sm-3">
                        <img className="w-100 h-100 rounded-circle" src={Utils.getProfileImageLink(post.user._id, post.user.profileImage)} alt="" />
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



    return (
        <div className="posts">
            {posts.map((post, key) => generatePostCard(post, key))}
        </div>
    );
}

export default PostCards;