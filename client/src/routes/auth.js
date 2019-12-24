import React, { Fragment, useContext } from 'react';
import Post from '../components/post';
import { Route } from 'react-router-dom';
import AuthContext from '../contexts/auth';

const AuthRoutes = () => {

    const { auth } = useContext(AuthContext);

    return auth && (
        <Fragment>
            <Route exact path="/post"><Post /></Route>
        </Fragment>
    );
}

export default AuthRoutes;