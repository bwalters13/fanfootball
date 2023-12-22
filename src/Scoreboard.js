import logo from './logo.svg';
import './Scoreboard.css';
import React, { Component, useEffect, useState } from 'react';
import { Client } from 'espn-fantasy-football-api';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import MyNavbar from './Navbar.js';

const teamPictures = {
    12: '/img/me.jpg',
    7: '/img/spence.jpg',
    14: '/img/shap.jpg',
    13: '/img/saum.jpg'
}




export default function Scoreboard({ loaded, teams, matchups }) {
    let scoreContent = [];

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

    if (loaded) {
        scoreContent = matchups.map((matchup) => {
            return (
                <div className="p-2" style={{ margin: 'auto', height: '80%', }}>
                    <Card style={{margin: 'auto'}} data-bs-theme="dark" className="matchup-card">
                        <Card.Body>
                            <Card.Title>
                                <Container>
                                    <Row>
                                        <div style={{width: '50%'}}>
                                            <Col><img style={{borderRadius: '30px'}} className="picture1" height="50" width="50" src={teamPictures[matchup.homeTeam]}></img></Col>
                                            <Col className="teamName">{teams[matchup.homeTeam].teamName}</Col>
                                        </div>
                                        <div style={{width: '50%'}}>
                                            <Col><img style={{borderRadius: '30px'}} className="picture2" height="50" width="50" src={teamPictures[matchup.awayTeam]}></img></Col>
                                            <Col className="teamName">{teams[matchup.awayTeam].teamName.split(' ')[0]}<br/>{teams[matchup.awayTeam].teamName.split(' ')[1]}</Col>
                                        </div>
                                    </Row>
                                </Container>
                            </Card.Title>
                            <Card.Text>
                                <Container>
                                    <Row>
                                        <Col style={{paddingBottom: '10%', fontSize: "x-large"}}>{teams[matchup.homeTeam].teamScore}</Col>
                                        <Col style={{paddingBottom: '10%', fontSize: "x-large"}}>{teams[matchup.awayTeam].teamScore}</Col>
                                    </Row>
                                    <Row>
                                        <Col className="sb-detail">Projected Score:</Col>
                                        <Col className="sb-detail">Yet To Play: </Col>
                                    
                                        <Col className="sb-detail">Projected Score:</Col>
                                        <Col className="sb-detail">Yet To Play:</Col>
                                    </Row>
                                    <Row>
                                        <Col className="sb-detail">{teams[matchup.homeTeam].projectedScore}</Col>
                                        <Col className="sb-detail">{teams[matchup.homeTeam].playersYetToPlay}</Col>
                                    
                                        <Col className="sb-detail">{teams[matchup.awayTeam].projectedScore}</Col>
                                        <Col className="sb-detail">{teams[matchup.awayTeam].playersYetToPlay}</Col>
                                    </Row>
                                </Container>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            )
        })
    }

    let direction = isMobile ? 'vertical' : 'horizontal';

    return (
        <div className="Scoreboard">
            <MyNavbar/>
            <img height="100" width="100" src="/img/belt.jpg" className="belt"></img>
            <Stack direction={direction} style={{ margin: 'auto'}}>
                {scoreContent}
            </Stack>
            {/* <div class="iframe-div">
                <iframe id="test" src="https://www.fantasypros.com/nfl/gameday.php" title="pbp" style={{width: '100%', height: '1000px'}}></iframe>  
            </div> */}
        </div>
    );
}