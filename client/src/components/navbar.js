import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

const NavbarLayout = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">SharingConcerns</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/Features">Features</Nav.Link>
                <Nav.Link href="/Pricing">Pricing</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="/signup">Sign up</Nav.Link>
                <Nav.Link href="/signin">Sign in</Nav.Link>
                <Nav.Link href="/signout">Sign out</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default NavbarLayout;