import React, { Fragment, useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import AuthContext from '../contexts/auth';
import axios from 'axios';

const NavbarLayout = () => {

    const { auth, setAuth } = useContext(AuthContext);

    const handleSignout = async e => {
        const { status } = (await axios.get('/user/signout')).data;
        status && setAuth(null);
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand as={NavLink} to="/">SharingConcerns</Navbar.Brand>
            <Nav className="mr-auto">
                {auth && (
                    <Fragment>
                        <Nav.Link as={NavLink} to={`/${auth.username}`}>My page</Nav.Link>
                        <Nav.Link as={NavLink} to="/all-posts">All posts</Nav.Link>
                        <Nav.Link as={NavLink} to="/post">Post</Nav.Link>
                    </Fragment>
                )}
            </Nav>
            <Nav>
                {
                    auth ? (
                        <Fragment>
                            <Nav.Link disabled>Hello, {auth.username}</Nav.Link>
                            <Nav.Link as={NavLink} to="/settings">Settings</Nav.Link>
                            <Nav.Link onClick={handleSignout}>Sign out</Nav.Link>
                        </Fragment>
                    ) : (
                            <Fragment>
                                <Nav.Link as={NavLink} to="/signup">Sign up</Nav.Link>
                                <Nav.Link as={NavLink} to="/signin">Sign in</Nav.Link>
                            </Fragment>
                        )
                }
            </Nav>
        </Navbar>
    );
}

export default NavbarLayout;