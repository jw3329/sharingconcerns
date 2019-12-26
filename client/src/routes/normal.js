import React from 'react';
import Home from '../components/home';
import { Signup, Signin } from '../components/sign';
import { Route, Switch } from 'react-router-dom';
import Error from '../components/error';


const NormalRoutes = () => {
    return (
        <Switch>
            <Route exact path="/"><Home /></Route>
            <Route exact path="/signup"><Signup /></Route>
            <Route exact path="/signin"><Signin /></Route>
            <Route><Error /></Route>
        </Switch>
    );
}

export default NormalRoutes;