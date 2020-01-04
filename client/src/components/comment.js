import React, { useState, useEffect, Fragment, useContext } from 'react';
import axios from 'axios';
import Utils from '../utils';
import AuthContext from '../contexts/auth';

const Comment = ({ id }) => {

    const [comments, setComments] = useState([]);
    const [inputComment, setInputComment] = useState('');
    const [message, setMessage] = useState('');
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`/post/${id}/comments`)
            .then(res => res.data)
            .then(comments => setComments(comments))
            .catch(err => console.log(err));
    }, [id]);

    const handleLike = async comment => {
        try {
            const { status, marked, message } = (await axios.post(`/comment/${comment._id}/like`)).data;
            if (!status) throw new Error(message);
            // if it was already marked, then we have to remove the mark
            comment.likes = marked ? comment.likes.filter(like => like !== auth._id) : [auth._id, ...comment.likes];
            setComments([...comments]);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDislike = async comment => {
        try {
            const { status, marked, message } = (await axios.post(`/comment/${comment._id}/dislike`)).data;
            if (!status) throw new Error(message);
            // same as above way
            comment.dislikes = marked ? comment.dislikes.filter(dislike => dislike !== auth._id) : [auth._id, ...comment.dislikes];
            setComments([...comments]);
        } catch (error) {
            console.log(error);
        }
    }

    const handleShowReply = () => {

    }

    const makeCard = (comment, key) => (
        <div className="card m-2" key={key}>
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-9">
                        {comment.description}
                    </div>
                    <div className="col-sm-3">
                        {Utils.toLocaleTimestamp()}
                    </div>
                </div>
                <div className="row">
                    <button className={`btn btn${comment.likes.includes(auth._id) ? '' : '-outline'}-success m-2`} onClick={() => handleLike(comment)}>Like({comment.likes.length})</button>
                    <button className={`btn btn${comment.dislikes.includes(auth._id) ? '' : '-outline'}-danger m-2`} onClick={() => handleDislike(comment)}>Dislike({comment.dislikes.length})</button>
                </div>
                <div className="row">
                    <button className="btn btn-primary m-2" onClick={() => handleShowReply(comment)}>Replies({comment.replies.length})</button>
                </div>
            </div>
        </div>
    );

    const handleSubmit = async e => {
        e.preventDefault();
        // make error message empty
        setMessage('');
        document.getElementById('inputComment').value = '';
        try {
            const res = (await axios.post(`/post/${id}/comment`, { description: inputComment })).data;
            if (!res.status) return setMessage(res.message);
            // make the newest comment on the top
            setComments([res.comment, ...comments]);
            // make it empty as well
            setInputComment('');
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleChange = e => {
        setInputComment(e.target.value);
    }


    return (
        <Fragment>
            <h1>Comment</h1>
            <form className="m-2" onSubmit={handleSubmit} onChange={handleChange}>
                <div className="form-group">
                    <label htmlFor="inputComment">Input comment</label>
                    <textarea className="form-control" id="inputComment" rows="3" />
                </div>
                {message && (
                    <div className="alert alert-danger" role="alert">
                        {message}
                    </div>
                )}
                <button className="btn btn-primary">Submit</button>
            </form>
            {comments.map((comment, key) => makeCard(comment, key))}
        </Fragment>
    );
}

export default Comment;