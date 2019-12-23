import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const NavbarLayout = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand as={NavLink} to="/">SharingConcerns</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/Features">Features</Nav.Link>
                <Nav.Link as={NavLink} to="/Pricing">Pricing</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link as={NavLink} to="/signup">Sign up</Nav.Link>
                <Nav.Link as={NavLink} to="/signin">Sign in</Nav.Link>
                <Nav.Link as={NavLink} to="/signout">Sign out</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default NavbarLayout;