import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
 
const About = () => {
    return (
        <div>
            <Navbar>
            <Navbar.Brand href="#home">
                <text className="d-inline-block align-top" style={{fontWeight: 'bold', marginLeft: '5%'}}>Living the Dream</text>
            </Navbar.Brand>
            <Nav>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            </Navbar>
            <h1>
                GeeksforGeeks is a Computer Science portal
                for geeks.
            </h1>
        </div>
    );
};
 
export default About;