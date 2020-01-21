import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/auth';
import Axios from 'axios';
import Utils from '../utils';
import { Link } from 'react-router-dom';

const Home = () => {

    const { auth } = useContext(AuthContext);
    const [activities, setActivities] = useState([]);

    document.title = 'Home';

    useEffect(() => {
        if (auth) {
            Axios.get('/user/activities')
                .then(res => res.data)
                .then(({ status, activities, message }) => {
                    if (!status) throw new Error(message);
                    setActivities(activities);
                })
                .catch(error => console.log(error.message));
        }
    }, [auth]);

    const generateCard = (activity, key) => (
        <div className="card m-3" key={key}>
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-3">
                        {Utils.getImageElement(activity.user._id, activity.user.profileImage)}
                    </div>
                    <div className="col-sm-6">
                        <Link to={`/post/${activity._id}`}>{activity.title}</Link>
                    </div>
                    <div className="col-sm-3" style={{ fontSize: "smaller" }}>
                        <div>{`${activity.views} views`}</div>
                        <div>{activity.user.username}</div>
                        <div>{Utils.toLocaleTimestamp(activity.updateDate)}</div>
                        <div className="d-flex justify-content-end">
                            <span className="badge badge-success m-2">{activity.likes.length} likes</span>
                            <span className="badge badge-danger m-2">{activity.dislikes.length} dislikes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return auth ? (
        <div className="row">
            <div className="col-sm-6">
                <h3 className="d-flex justify-content-center">Recent activities</h3>
                {activities.map((activity, key) => generateCard(activity, key))}
            </div>
        </div>
    ) : (
            <div>Please sign in to start</div>
        );
}

export default Home;