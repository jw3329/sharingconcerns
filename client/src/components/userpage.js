import React, { useEffect, useState, Fragment, useContext } from 'react';
import Axios from 'axios';
import Error from '../components/error';
import AuthContext from '../contexts/auth';
import PostCards from './postcards';
import Follow from './follow';

const UserPage = props => {

    const { username } = props.match.params;
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { auth } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        let mounted = false;
        Axios.get(`/user/${username}`)
            .then(res => res.data)
            .then(({ status, user }) => (!mounted && status && setUser(user)) || status)
            .then(status => {
                status && Axios.get(`/post/user/${username}`)
                    .then(res => res.data)
                    .then(({ status, posts }) => !mounted && status && setPosts([...posts]))
            })
            .finally(() => setLoaded(true));
        return () => mounted = true;
    }, [username]);


    const handleFollow = async () => {
        try {
            const { status, following, message } = (await Axios.post('/user/follow', { username })).data;
            if (!status) throw new Error(message);
            user.followers = following ? [...user.followers, auth._id] : user.followers.filter(followerId => followerId !== auth._id);
            setUser({ ...user });
        } catch (error) {
            console.log(error.message);
        }
    }

    return loaded && (
        user ? (
            <Fragment>
                <div className="d-flex">
                    <h1>{username}'s page</h1>
                    {auth._id !== user._id && (
                        <div className="ml-auto">
                            <button onClick={handleFollow} className={`btn btn-${user.followers.find(follower => follower._id === auth._id) ? 'secondary' : 'primary'} m-2`}>{user.followers.find(follower => follower._id === auth._id) ? 'Unfollow' : 'Follow'}</button>
                        </div>
                    )}
                </div>
                <div className="row p-3">
                    <div className="col-sm-6 border-right">
                        <h3>Post</h3>
                        <PostCards posts={posts} />
                    </div>
                    <div className="col-sm-3 border-right text-center">
                        <h3>Followers</h3>
                        <Follow follows={user.followers} />
                    </div>
                    <div className="col-sm-3 text-center">
                        <h3>Followees</h3>
                        <Follow follows={user.followees} />
                    </div>
                </div>
            </Fragment>
        ) : (
                <Error />
            )
    );
}

export default UserPage;