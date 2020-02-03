import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/auth';
import Axios from 'axios';
import Utils from '../utils';

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

    return auth ? (
        <div className="row">
            <div className="col-sm-6">
                <h3 className="d-flex justify-content-center">Recent activities</h3>
                {Utils.getPostCards(activities)}
            </div>
        </div>
    ) : (
            <div>Please sign in to start</div>
        );
}

export default Home;