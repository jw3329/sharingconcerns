import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Utils from '../utils';

const Comment = ({ id }) => {

    const [comments, setComments] = useState([]);
    const [inputComment, setInputComment] = useState('');

    useEffect(() => {
        axios.get(`/post/${id}/comments`)
            .then(res => res.data)
            .then(comments => setComments(comments))
            .catch(err => console.log(err));
    }, [id]);

    const makeCard = (comment, key) => (
        <div className="card m-2" key={key}>
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-9">
                        {comment.description}
                    </div>
                    <div className="col-sm-3">
                        {Utils.toLocaleTimestamp(comment.updateDate)}
                    </div>
                </div>
            </div>
        </div>
    );

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = (await axios.post(`/post/${id}/comment`, { description: inputComment })).data;
            setComments([res.comment, ...comments]);
        } catch (error) {
            console.log(error);
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
                <button className="btn btn-primary">Submit</button>
            </form>
            {comments.map((comment, key) => makeCard(comment, key))}
        </Fragment>
    );
}

export default Comment;