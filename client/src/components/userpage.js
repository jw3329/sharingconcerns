import React, { useEffect, useState, Fragment, useContext } from 'react';
import Axios from 'axios';
import Error from '../components/error';
import AuthContext from '../contexts/auth';
import PostCards from './postcards';

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
                <h1>{username}'s page</h1>
                {auth._id !== user._id && (
                    <div className="d-flex justify-content-end">
                        <button onClick={handleFollow} className={`btn btn-${user.followers.includes(auth._id) ? 'secondary' : 'primary'} m-2`}>{user.followers.includes(auth._id) ? 'Unfollow' : 'Follow'}</button>
                    </div>
                )}
                <h3>Post</h3>
                <PostCards posts={posts} />

            </Fragment>
        ) : (
                <Error />
            )
    );
}

export default UserPage;