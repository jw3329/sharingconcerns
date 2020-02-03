import React, { Fragment, useEffect, useState } from 'react';
import Utils from '../utils';
import Axios from 'axios';

const AllPosts = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        Axios.get('/post')
            .then(res => res.data)
            .then(({ status, posts, message }) => status ? setPosts(posts) : console.log(message));
    }, []);

    return (
        <Fragment>
            <h1>All posts</h1>
            <div className="row">
                <div className="col-sm-6">
                    {Utils.getPostCards(posts)}
                </div>
            </div>
        </Fragment>
    );
}

export default AllPosts;