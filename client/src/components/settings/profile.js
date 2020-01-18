import React, { useState, useContext, Fragment } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import AuthContext from '../../contexts/auth';
import axios from 'axios';
import defaultProfile from '../../images/default-profile.png';
import Utils from '../../utils';

const Profile = () => {

    const { auth, setAuth } = useContext(AuthContext);
    const [profileForm, setProfileForm] = useState({});
    const [message, setMessage] = useState({});
    const [profileImage, setProfileImage] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage({});
        if (profileImage !== false) {
            const profileImageData = new FormData();
            profileImageData.append('image', profileImage);
            await axios.put(`/user/profileImage`, profileImageData);
        }
        const { status, user, message } = (await axios.put(`/user`, profileForm)).data;
        setMessage({ status, message });
        setAuth(user);
    }

    const handleChange = e => {
        if (e.target.id === 'profileImage') {
            handleProfileImageChange(e);
        } else {
            setProfileForm({
                ...profileForm,
                [e.target.id]: e.target.value
            });
        }
    }

    const handleProfileImageChange = e => {
        setProfileImage(e.target.files[0] || null);
    }

    return (
        <Form onSubmit={handleSubmit} onChange={handleChange}>
            <Row className="justify-content-md-center">
                <Col sm={6}>
                    <div className="form-group">
                        {
                            // complex operation is needed to show up in the frontend
                            (() => {
                                const src = (() => {
                                    let src = null;
                                    if (profileImage === null) {
                                        src = defaultProfile;
                                    } else if (profileImage) {
                                        src = URL.createObjectURL(profileImage);
                                    } else {
                                        if (auth.profileImage) src = Utils.getProfileImageLink(auth._id);
                                        else src = defaultProfile;
                                    }
                                    console.log(src)
                                    return src;
                                })();
                                return (
                                    <Fragment>
                                        {<label htmlFor="profileImage"><img className="w-50 h-50" src={profileImage ? URL.createObjectURL(profileImage) : Utils.getProfileImageLink(auth._id, auth.profileImage)} alt="" /></label>}
                                        {src !== defaultProfile && <div className="my-2"><button className="btn btn-primary w-50" onClick={() => setProfileImage(null)}>Clear</button></div>}
                                    </Fragment>
                                );
                            })()
                        }
                        <p>Click to change</p>
                        <input type="file" className="form-control-file d-none" id="profileImage" accept="image/*" />
                    </div>
                    <Form.Group controlId="firstName">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control type="text" placeholder="Firstname" defaultValue={auth.firstName} />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control type="text" placeholder="Lastname" defaultValue={auth.lastName} />
                    </Form.Group>
                    <Form.Group controlId="bio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control type="text" placeholder="Bio" defaultValue={auth.bio} />
                    </Form.Group>
                    <Form.Group controlId="url">
                        <Form.Label>URL</Form.Label>
                        <Form.Control type="text" placeholder="URL" defaultValue={auth.url} />
                    </Form.Group>
                    <Form.Group controlId="company">
                        <Form.Label>Company</Form.Label>
                        <Form.Control type="text" placeholder="Company" defaultValue={auth.company} />
                    </Form.Group>
                    <Form.Group controlId="location">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" placeholder="Location" defaultValue={auth.location} />
                    </Form.Group>
                    <Button className="mb-2" variant="primary" type="submit">Update</Button>
                    {
                        message.status !== undefined && (
                            <Alert className="mt-3" variant={message.status ? 'success' : 'danger'}>
                                {message.message}
                            </Alert>
                        )
                    }
                </Col>
            </Row>
        </Form>
    );
}

export default Profile;