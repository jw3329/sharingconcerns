import React, { useState, useEffect, Fragment, useContext } from 'react';
import axios from 'axios';
import Utils from '../utils';
import AuthContext from '../contexts/auth';
import { Accordion, Button } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';

const Comment = ({ id }) => {

    const [comments, setComments] = useState([]);
    const [inputComment, setInputComment] = useState('');
    const [message, setMessage] = useState('');
    const { auth } = useContext(AuthContext);

    // for input purpose
    const [idMapReply, setIdMapReply] = useState({});
    const [idMapReplyMessage, setIdMapReplyMessage] = useState({});
    // for showing purpose, comment id mapping to reply objects array
    const [idMapShowReply, setIdMapShowReply] = useState({});

    useEffect(() => {
        axios.get(`/post/${id}/comments`)
            .then(res => res.data)
            .then(({ status, comments }) => status && setComments(comments))
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
            setIdMapShowReply({ ...idMapShowReply, [comment._id]: [...currentCommentReply, reply] });
            e.target.getElementsByTagName('textarea')[0].value = '';
            setIdMapReply({ ...idMapReply, [comment._id]: '' });
            // increment comment reply number after submitting
            comment.replies = [reply._id, ...comment.replies];
            // reset the comments
            setComments([...comments]);
        } catch (error) {
            setIdMapReplyMessage({ ...idMapReplyMessage, [comment._id]: error.message });
            // console.log(error.message);
        }
    }

    const handleCommentEdit = comment => {
        comment.edit = !comment.edit;
        setComments([...comments]);
    }

    const handleReplyEdit = reply => {
        reply.edit = !reply.edit;
        setIdMapShowReply({ ...idMapShowReply });
    }

    const handleCommentDelete = async comment => {
        try {
            const { status, message } = (await axios.delete(`/post/${id}/comment/${comment._id}`)).data;
            if (!status) throw new Error(message);
            setComments(comments.filter(postComment => postComment._id !== comment._id));
        } catch (error) {
            console.log(error.message);
        }
    }

    const makeCard = (comment, key) => (
        <div className="card m-2" key={key}>
            <div className="card-body">
                <div className="row m-3">
                    <div className="col-sm-2">{comment.user.username}</div>
                    {
                        comment.edit ? (
                            <TextareaAutosize minRows={3} className="w-100 col-sm-7" style={{ resize: 'none' }}
                                onChange={e => {
                                    comment.originalValue = comment.originalValue || comment.description;
                                    comment.description = e.target.value;
                                    setComments([...comments]);
                                }}
                                defaultValue={comment.description} />
                        ) : (
                                <div className="col-sm-7" style={{ whiteSpace: 'pre-line' }}>
                                    {comment.description}
                                </div>
                            )
                    }
                    <div className="ml-auto">
                        {Utils.toLocaleTimestamp(comment.updateDate)}
                    </div>
                </div>
                <Accordion>
                    <div className="row m-3">
                        <div className="offset-sm-2">
                            <Accordion.Toggle as={Button} variant="link" onClick={() => handleShowReply(comment)} eventKey="0">Show Replies({comment.replies.length})</Accordion.Toggle>
                        </div>
                        <div className="ml-auto">
                            {
                                comment.edit ? (
                                    <Fragment>
                                        <button className="btn btn-primary m-2"
                                            onClick={async () => {
                                                try {
                                                    const { status, comment: newComment, message } = (await axios.put(`/post/${id}/comment/${comment._id}`, { description: comment.description })).data;
                                                    if (!status) throw new Error(message);
                                                    Object.assign(comment, newComment, { originalValue: undefined });
                                                    handleCommentEdit(comment);
                                                } catch (error) {
                                                    console.log(error.message);
                                                }
                                            }}>Submit</button>
                                        <button className="btn btn-danger m-2" onClick={() => { comment.description = comment.originalValue || comment.description; handleCommentEdit(comment); }}>Cancel</button>
                                    </Fragment>
                                ) : (
                                        <Fragment>
                                            {comment.user._id === auth._id && (
                                                <Fragment>
                                                    <button className="btn btn-primary m-2" onClick={() => handleCommentEdit(comment)} >Edit</button>
                                                    <button className="btn btn-danger m-2" onClick={() => handleCommentDelete(comment)}>Delete</button>
                                                </Fragment>
                                            )}
                                            <button className={`btn btn${comment.likes.includes(auth._id) ? '' : '-outline'}-success m-2`} onClick={() => handleLike(comment)}>Like({comment.likes.length})</button>
                                            <button className={`btn btn${comment.dislikes.includes(auth._id) ? '' : '-outline'}-danger m-2`} onClick={() => handleDislike(comment)}>Dislike({comment.dislikes.length})</button>
                                        </Fragment>
                                    )
                            }
                        </div>
                    </div>
                    <div className="m-3">
                        <Accordion.Collapse eventKey="0">
                            <Fragment>
                                <form className="m-2" onChange={e => handleReplyChange(e, comment)} onSubmit={e => handleReplySubmit(e, comment)}>
                                    <div className="form-group">
                                        <label htmlFor="inputComment">Type reply</label>
                                        <TextareaAutosize className={"form-control" + (idMapReplyMessage[comment._id] ? ' is-invalid' : '')} minRows={3} style={{ resize: 'none' }} />
                                        {idMapReplyMessage[comment._id] && (
                                            <div className="invalid-feedback">
                                                {idMapReplyMessage[comment._id]}
                                            </div>
                                        )}
                                    </div>
                                    <button className="btn btn-primary">Submit</button>
                                </form>
                                {idMapShowReply[comment._id] && idMapShowReply[comment._id].map((reply, key) => makeReplyCard(comment, reply, key))}
                            </Fragment>
                        </Accordion.Collapse>
                    </div>
                </Accordion>
                <div>
                </div>
            </div>
        </div >
    );

    const makeReplyCard = (comment, reply, key) => (
        <div className="card m-3" key={key}>
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-2">{reply.user.username}</div>
                    {
                        reply.edit ? (
                            <TextareaAutosize minRows={3} className="w-100 col-sm-7" style={{ resize: 'none' }}
                                onChange={e => {
                                    reply.originalValue = reply.originalValue || reply.description;
                                    reply.description = e.target.value;
                                    // make it happen after changing the value
                                    setIdMapShowReply({ ...idMapShowReply });
                                }}
                                defaultValue={reply.description} />
                        ) : (
                                <div className="col-sm-7" style={{ whiteSpace: 'pre-line' }}>
                                    {reply.description}
                                </div>
                            )
                    }
                    <div className="ml-auto">
                        <div className="m-2">
                            {Utils.toLocaleTimestamp(reply.updateDate)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="ml-auto">
                        {
                            reply.edit ? (
                                <Fragment>
                                    <button className="btn btn-primary m-2"
                                        onClick={async () => {
                                            try {
                                                const { status, reply: newReply, message } = (await axios.put(`/comment/${comment._id}/reply/${reply._id}`, { description: reply.description })).data;
                                                if (!status) throw new Error(message);
                                                Object.assign(reply, newReply, { originalValue: undefined });
                                                handleReplyEdit(reply);
                                            } catch (error) {
                                                console.log(error.message);
                                            }
                                        }}>Submit</button>
                                    <button className="btn btn-danger m-2" onClick={() => { reply.description = reply.originalValue || reply.description; handleReplyEdit(reply); }}>Cancel</button>
                                </Fragment>
                            ) : (
                                    <Fragment>
                                        {reply.user._id === auth._id && (
                                            <Fragment>
                                                <button className="btn btn-primary m-2" onClick={() => handleReplyEdit(reply)}>Edit</button>
                                                <button className="btn btn-danger m-2" onClick={async () => {
                                                    try {
                                                        const { status, message } = (await axios.delete(`/comment/${comment._id}/reply/${reply._id}`)).data;
                                                        if (!status) throw new Error(message);
                                                        setIdMapShowReply({ ...idMapShowReply, [comment._id]: idMapShowReply[comment._id].filter(postReply => postReply._id !== reply._id) });
                                                        comment.replies = comment.replies.filter(postReply => postReply !== reply._id);
                                                        setComments([...comments]);
                                                    } catch (error) {
                                                        console.log(error.message);
                                                    }
                                                }} >Delete</button>
                                            </Fragment>
                                        )}
                                        <button className={`btn btn${reply.likes.includes(auth._id) ? '' : '-outline'}-success m-2`} onClick={() => handleLike(reply)}>Like({reply.likes.length})</button>
                                        <button className={`btn btn${reply.dislikes.includes(auth._id) ? '' : '-outline'}-danger m-2`} onClick={() => handleDislike(reply)}>Dislike({reply.dislikes.length})</button>
                                    </Fragment>
                                )
                        }

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
            setComments([...comments, res.comment]);
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
                    <TextareaAutosize className="form-control" id="inputComment" minRows={3} style={{ resize: 'none' }} />
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