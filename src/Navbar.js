import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';

const MyNavbar = () => {
    return (
        <div>
            <Navbar>
              
                <Nav>
                    <Stack>
                        <Row>
                            <Col>
                                <Nav.Link href="/">Scoreboard</Nav.Link>
                            </Col>
                            <Col>
                                <Nav.Link href="/scores">Matchups</Nav.Link>
                            </Col>
                        </Row>
                    </Stack>
                </Nav>
            </Navbar>
        </div>
    )
}

export default MyNavbar;
