import React, { Fragment } from 'react';
import NormalRoutes from './normal';
import AuthRoutes from './auth';
import { Route, Switch } from 'react-router-dom';
import Error from '../components/error';


const RoutesIndex = () => {
    return (
        <Fragment>
            <Switch>
                <NormalRoutes />
                <AuthRoutes />
                <Route><Error /></Route>
            </Switch>
        </Fragment>
    );
}

export default RoutesIndex;