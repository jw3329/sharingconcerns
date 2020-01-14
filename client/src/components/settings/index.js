import React, { Fragment, useEffect, useState } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import Error from '../error';
import Profile from './profile';
import { Nav } from 'react-bootstrap';

const Settings = props => {

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const path = props.location.pathname.substring('/settings'.length);
        // if no path is entered, redirect to profile link
        if (!path) props.history.replace('/settings/profile');
        setLoaded(true);
    }, [props.history, props.location, setLoaded]);

    const routeMap = {
        '/profile': Profile
    }

    return loaded && (
        <Fragment>
            <Nav justify fill variant="tabs">
                <Nav.Item>
                    <Nav.Link as={NavLink} eventKey="0" to="/settings/profile">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={NavLink} eventKey="1" to="/settings/none">Loooonger NavLink</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={NavLink} eventKey="2" to="/settings/none">Link</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={NavLink} eventKey="3" to="/settings/none" disabled>
                        Disabled
                </Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                <Switch>
                    {(() => {
                        const routes = [];
                        for (const path in routeMap) {
                            routes.push(<Route exact key={path} path={`/settings${path}`} component={routeMap[path]} />)
                        }
                        routes.push(<Route key={'error'} component={Error} />);
                        return routes;
                    })()}
                </Switch>

            </div>
        </Fragment>

    );
}

export default Settings;