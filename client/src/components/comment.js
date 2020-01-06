import React, { useState, useEffect, Fragment, useContext } from 'react';
import axios from 'axios';
import Utils from '../utils';
import AuthContext from '../contexts/auth';
import { Accordion, Button } from 'react-bootstrap';

const Comment = ({ id }) => {

    const [comments, setComments] = useState([]);
    const [inputComment, setInputComment] = useState('');
    const [message, setMessage] = useState('');
    const { auth } = useContext(AuthContext);
    const [idMapReply, setIdMapReply] = useState({});
    const [idMapReplyMessage, setIdMapReplyMessage] = useState({});
    const [idMapShowReply, setIdMapShowReply] = useState({});

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

    const handleShowReply = async comment => {
        try {
            const { status, replies, message } = (await axios.get(`/comment/${comment._id}/replies`)).data;
            if (!status) throw new Error(message);
            setIdMapShowReply({ ...idMapShowReply, [comment._id]: replies });
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleReplyChange = (e, comment) => {
        setIdMapReply({ ...idMapReply, [comment._id]: e.target.value });
    }

    const handleReplySubmit = async (e, comment) => {
        e.preventDefault();
        e.persist();
        setIdMapReplyMessage({ ...idMapReplyMessage, [comment._id]: '' });
        try {
            const { status, reply, message } = (await axios.post(`/comment/${comment._id}/reply`, { description: idMapReply[comment._id] })).data;
            if (!status) throw new Error(message);
            // add to the frontend right away
            // reset the input form
            const currentCommentReply = idMapShowReply[comment._id];
            setIdMapShowReply({ ...idMapShowReply, [comment._id]: [reply, ...currentCommentReply] });
            e.target.getElementsByTagName('textarea')[0].value = '';
            setIdMapReply({ ...idMapReply, [comment._id]: '' });
        } catch (error) {
            setIdMapReplyMessage({ ...idMapReplyMessage, [comment._id]: error.message });
            // console.log(error.message);
        }
    }

    const makeCard = (comment, key) => (
        <div className="card m-2" key={key}>
            <div className="card-body">
                <div className="row m-3">
                    <div className="col-sm-9">
                        {comment.description}
                    </div>
                    <div className="ml-auto">
                        {Utils.toLocaleTimestamp(comment.updateDate)}
                    </div>
                </div>
                <Accordion>
                    <div className="row m-3">
                        <Accordion.Toggle as={Button} variant="link" onClick={() => handleShowReply(comment)} eventKey="0">Show Replies({comment.replies.length})</Accordion.Toggle>
                        <div className="ml-auto">
                            <button className={`btn btn${comment.likes.includes(auth._id) ? '' : '-outline'}-success m-2`} onClick={() => handleLike(comment)}>Like({comment.likes.length})</button>
                            <button className={`btn btn${comment.dislikes.includes(auth._id) ? '' : '-outline'}-danger m-2`} onClick={() => handleDislike(comment)}>Dislike({comment.dislikes.length})</button>
                        </div>
                    </div>
                    <div className="m-3">
                        <Accordion.Collapse eventKey="0">
                            <Fragment>
                                <form className="m-2" onChange={e => handleReplyChange(e, comment)} onSubmit={e => handleReplySubmit(e, comment)}>
                                    <div className="form-group">
                                        <label htmlFor="inputComment">Type reply</label>
                                        <textarea className={"form-control" + (idMapReplyMessage[comment._id] ? ' is-invalid' : '')} rows="3" />
                                        {idMapReplyMessage[comment._id] && (
                                            <div className="invalid-feedback">
                                                {idMapReplyMessage[comment._id]}
                                            </div>
                                        )}
                                    </div>
                                    <button className="btn btn-primary">Submit</button>
                                </form>
                                {idMapShowReply[comment._id] && idMapShowReply[comment._id].map((reply, key) => makeReplyCard(reply, key))}
                            </Fragment>
                        </Accordion.Collapse>
                    </div>
                </Accordion>
                <div>
                </div>
                {/* <div className="m-3">
                    {idMapShowReply[comment._id] && (
                        <Accordion.Collapse eventKey="0">
                            <Fragment>
                            </Fragment>
                        </Accordion.Collapse>
                    )}
                </div> */}
            </div>
        </div>
    );

    const makeReplyCard = (reply, key) => (
        <div className="card m-3" key={key}>
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-9">
                        {reply.description}
                    </div>
                    <div className="ml-auto">
                        <div className="m-2">
                            {Utils.toLocaleTimestamp(reply.updateDate)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="ml-auto">
                        <button className={`btn btn${reply.likes.includes(auth._id) ? '' : '-outline'}-success m-2`} onClick={() => handleLike(reply)}>Like({reply.likes.length})</button>
                        <button className={`btn btn${reply.dislikes.includes(auth._id) ? '' : '-outline'}-danger m-2`} onClick={() => handleDislike(reply)}>Dislike({reply.dislikes.length})</button>
                    </div>
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
                    <label htmlFor="inputComment">Type comment</label>
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