import React, { Fragment } from 'react';
import Home from '../components/home';
import { Signup, Signin } from '../components/sign';
import { Route } from 'react-router-dom';

const NormalRoutes = () => {
    return (
        <Fragment>
            <Route exact path="/"><Home /></Route>
            <Route exact path="/signup"><Signup /></Route>
            <Route exact path="/signin"><Signin /></Route>
        </Fragment>
    );
}

export default NormalRoutes;