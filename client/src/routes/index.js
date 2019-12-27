import React, { Fragment, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import Error from '../components/error';
import { Signup, Signin } from '../components/sign';
import Home from '../components/home';
import Post from '../components/post';
import PostThread from '../components/post_thread';
import AuthContext from '../contexts/auth';



const RoutesIndex = () => {

    const { auth } = useContext(AuthContext);

    return (
        <Switch>
            <Route exact path="/"><Home /></Route>
            <Route exact path="/signup"><Signup /></Route>
            <Route exact path="/signin"><Signin /></Route>
            {auth && (
                <Fragment>
                    <Route exact path="/post"><Post /></Route>
                    <Route exact path="/post/:id" component={PostThread} />
                </Fragment>
            )}
            <Route><Error /></Route>
        </Switch>
    );
}

export default RoutesIndex;