import React, { useContext, useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Error from '../components/error';
import { Signup, Signin } from '../components/sign';
import Home from '../components/home';
import Post from '../components/post';
import PostThread from '../components/post_thread';
import AuthContext from '../contexts/auth';
import Settings from '../components/settings';


const RoutesIndex = () => {

    const { auth } = useContext(AuthContext);
    const [routes, setRoutes] = useState({
        '/': { component: Home, exact: true },
        '/signup': { component: Signup, exact: true },
        '/signin': { component: Signin, exact: true }
    });

    useEffect(() => {
        if (auth) {
            const authRoutes = {
                '/post': { component: Post, exact: true },
                '/post/:id': { component: PostThread, exact: true },
                '/settings': { component: Settings, exact: false }
            }
            setRoutes(routes => ({ ...routes, ...authRoutes }));
        }
    }, [auth]);

    return (
        <Switch>
            {(() => {
                const res = [];
                for (const path in routes) {
                    res.push(<Route exact={routes[path].exact} path={path} key={path} component={routes[path].component}></Route>);
                }
                res.push(<Route key={'error'} component={Error} />);
                return res;
            })()}
        </Switch>
    );
}

export default RoutesIndex;