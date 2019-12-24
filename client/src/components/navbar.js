import React, { Fragment, useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import AuthContext from '../contexts/auth';

const NavbarLayout = () => {

    const { auth } = useContext(AuthContext);

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand as={NavLink} to="/">SharingConcerns</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/Features">Features</Nav.Link>
                <Nav.Link as={NavLink} to="/Pricing">Pricing</Nav.Link>
            </Nav>
            <Nav>
                {
                    auth ?
                        <Fragment>
                            <Nav.Link disabled>Hello, {auth.username}</Nav.Link>
                            <Nav.Link as={NavLink} to="/signout">Sign out</Nav.Link>
                        </Fragment>
                        :
                        <Fragment>
                            <Nav.Link as={NavLink} to="/signup">Sign up</Nav.Link>
                            <Nav.Link as={NavLink} to="/signin">Sign in</Nav.Link>
                        </Fragment>
                }
            </Nav>
        </Navbar>
    );
}

export default NavbarLayout;