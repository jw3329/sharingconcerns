import React, { useEffect, useState, Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Utils from '../utils';
import Comment from './comment';
import AuthContext from '../contexts/auth';
import { Modal } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';


const PostThread = props => {

    const { id } = props.match.params;
    const [post, setPost] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { auth } = useContext(AuthContext);
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [editting, setEditting] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        axios.get(`/post/${id}`)
            .then(res => res.data)
            .then(({ status, post, message }) => {
                if (!status) console.log(message);
                setPost(post);
                // condition if liked or not
                setLike(post.likes.includes(auth._id));
                setDislike(post.dislikes.includes(auth._id));
                setEditForm({
                    title: post.title,
                    description: post.description
                });
            })
            .then(() => setLoaded(true))
            .catch(err => console.log(err.message) || props.history.replace('/error/not_found'));
    }, [id, auth, props.history]);

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


    const handleEditSubmit = async () => {
        try {
            const { status, post, message } = (await axios.put(`/post/${id}`, editForm)).data;
            if (!status) throw new Error(message);
            console.log(post)
            setPost(post);
        } catch (error) {
            console.log(error);
        }
        setEditting(false);
    }

    const handleDelete = async () => {
        try {
            const { status, message } = (await axios.delete(`/post/${id}`)).data;
            if (!status) throw new Error(message);
            props.history.replace('/post');
        } catch (error) {
            console.log(error.message);
        }
    }

    return loaded && (
        <Fragment>
            <div className="m-2">
                <Link to='/post'>Go back</Link>
            </div>
            <div className="card">
                {
                    editting ? (
                        <input type="text" className="d-flex justify-content-center text-center" onChange={e => setEditForm({ ...editForm, title: e.target.value })} defaultValue={editForm.title} />
                    ) : (
                            <h5 className="d-flex justify-content-center card-header">{post.title}</h5>
                        )
                }
                <div className="card-body">
                    <div className="d-flex flex-column align-items-end" style={{ fontSize: 'smaller' }}>
                        <div>{post.views} views</div>
                        <div>{post.user.username}</div>
                        <div>{Utils.toLocaleTimestamp(post.updateDate)}</div>
                    </div>
                    {
                        editting ? (
                            <TextareaAutosize className="w-100" onChange={e => setEditForm({ ...editForm, description: e.target.value })} defaultValue={editForm.description} style={{ resize: 'none' }} />
                        ) : (
                                <h5 className="card-text d-block" style={{ whiteSpace: 'pre-line' }}>{post.description}</h5>
                            )
                    }
                    <div className="d-flex justify-content-end mt-5">
                        {
                            editting ? (
                                <Fragment>
                                    <button className="btn btn-primary m-2" onClick={handleEditSubmit}>Submit</button>
                                    <button className="btn btn-danger m-2" onClick={() => { setEditForm({ title: post.title, description: post.description }); setEditting(false); }}>Cancel</button>
                                </Fragment>
                            ) : (
                                    <Fragment>
                                        {post.user._id === auth._id && (
                                            <Fragment>
                                                <button className="btn btn-primary m-3" onClick={() => setEditting(true)}>Edit</button>
                                                <button className="btn btn-danger m-3" onClick={() => setConfirm(true)}>Delete</button>
                                            </Fragment>
                                        )}
                                        < button className={`btn btn${like ? '' : '-outline'}-success m-3`} onClick={handleLike}>Like({post.likes.length})</button>
                                        <button className={`btn btn${dislike ? '' : '-outline'}-danger m-3`} onClick={handleDislike}>Dislike({post.dislikes.length})</button>
                                    </Fragment>
                                )
                        }
                    </div>
                </div>
            </div>
            <Comment id={id} />
            {/* Modal showing up here */}
            <Modal show={confirm} onHide={() => setConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Do you really want to delete?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <div className="btn btn-primary" onClick={() => { handleDelete(); setConfirm(false); }}>Yes</div>
                    <div className="btn btn-danger" onClick={() => setConfirm(false)}>No</div>
                </Modal.Footer>
            </Modal>
        </Fragment >
    );
}

export default PostThread;