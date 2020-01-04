import React, { useEffect, useState, Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Utils from '../utils';
import Comment from './comment';
import AuthContext from '../contexts/auth';


const PostThread = props => {

    const { id } = props.match.params;
    const [post, setPost] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { auth } = useContext(AuthContext);
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);

    useEffect(() => {
        axios.get(`/post/${id}`)
            .then(res => res.data)
            .then(({ status, post, message }) => {
                if (!status) console.log(message);
                setPost(post);
                // condition if liked or not
                setLike(post.likes.includes(auth._id));
                setDislike(post.dislikes.includes(auth._id));
            })
            .then(() => setLoaded(true))
            .catch(err => console.log(err));
    }, [id, auth._id]);

    document.title = post && post.title;

    const handleLike = async () => {
        try {
            const { status, marked, message } = (await axios.post(`/post/${id}/like`)).data;
            if (!status) throw new Error(message);
            post.likes = marked ? post.likes.filter(like => like !== auth._id) : [auth._id, ...post.likes];
            setPost({ ...post });
            setLike(!marked);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDislike = async () => {
        try {
            const { status, marked, message } = (await axios.post(`/post/${id}/dislike`)).data;
            if (!status) throw new Error(message);
            post.dislikes = marked ? post.dislikes.filter(dislike => dislike !== auth._id) : [auth._id, ...post.dislikes];
            setPost({ ...post });
            setDislike(!marked);
        } catch (error) {
            console.log(error);
        }
    }


    return loaded && (
        <Fragment>
            <div className="m-2">
                <Link to='/post'>Go back</Link>
            </div>
            <div className="card">
                <h5 className="d-flex justify-content-center card-header">{post.title}</h5>
                <div className="card-body">
                    <p className="d-flex justify-content-end">{Utils.toLocaleTimestamp()}</p>
                    <h5 className="card-text">{post.description}</h5>
                    <div className="row mt-5">
                        <button className={`justify-content-start btn btn${like ? '' : '-outline'}-success m-3`} onClick={handleLike}>Like({post.likes.length})</button>
                        <button className={`justify-content-end btn btn${dislike ? '' : '-outline'}-danger m-3`} onClick={handleDislike}>Dislike({post.dislikes.length})</button>
                    </div>
                </div>
            </div>
            <Comment id={id} />
        </Fragment>
    );
}

export default PostThread;