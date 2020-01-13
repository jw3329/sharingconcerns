import React, { useContext, useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Error from '../components/error';
import { Signup, Signin } from '../components/sign';
import Home from '../components/home';
import Post from '../components/post';
import PostThread from '../components/post_thread';
import AuthContext from '../contexts/auth';
import Setting from '../components/setting';



const RoutesIndex = () => {

    const { auth } = useContext(AuthContext);
    const [routes, setRoutes] = useState({
        '/': Home,
        '/signup': Signup,
        '/signin': Signin
    });

    useEffect(() => {
        if (auth) {
            const authRoutes = {
                '/post': Post,
                '/post/:id': PostThread,
                '/setting': Setting
            }
            setRoutes(routes => ({ ...routes, ...authRoutes }));
        }
    }, [auth]);

    return (
        <Switch>
            {(() => {
                const res = [];
                for (const path in routes) {
                    res.push(<Route exact path={path} key={path} component={routes[path]}></Route>);
                }
                res.push(<Route key={'error'}><Error /></Route>);
                return res;
            })()}
        </Switch>
    );
}

export default RoutesIndex;