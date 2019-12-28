import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';


const PostThread = props => {

    const { id } = props.match.params;
    const [post, setPost] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        axios.get(`/post/${id}`)
            .then(res => res.data)
            .then(({ status, post, message }) => status ? setPost(post) : console.log(message))
            .then(() => setLoaded(true))
            .catch(err => console.log(err));
    }, [id]);

    return loaded && (
        <Fragment>
            <div className="card">
                <h5 className="d-flex justify-content-center card-header">{post.title}</h5>
                <div className="card-body">
                    <p className="d-flex justify-content-end">{`${new Date(post.updateDate).toLocaleDateString()} ${new Date(post.updateDate).toLocaleTimeString()}`}</p>
                    <h5 className="card-text">{post.description}</h5>
                </div>
            </div>
            <div className="likeComponent mt-5">
                <button className="justify-content-start btn btn-success m-3">Like</button>
                <button className="justify-content-end btn btn-danger m-3">Dislike</button>
            </div>
            <h1>Comments</h1>
        </Fragment>
    );
}

export default PostThread;