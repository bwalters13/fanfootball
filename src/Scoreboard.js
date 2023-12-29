import logo from './logo.svg';
import './Scoreboard.css';
import React, { Component, useEffect, useState } from 'react';
import { Client } from 'espn-fantasy-football-api';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import MyNavbar from './Navbar.js';
import { ArrowClockwise, Calculator, XCircleFill } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Lineups from './lineups.js';

const teamPictures = {
    12: '/img/me.jpg',
    7: '/img/spence.jpg',
    14: '/img/shap.jpg',
    13: '/img/saum.jpg'
}




export default function Scoreboard({ loaded, teams, matchups, refreshFunc }) {
    
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

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        refreshFunc();
    }
    const handleShow = () => setShow(true);

    const isMobile = width <= 768;

    if (loaded) {
        let wins = 0;
        for (let i = 0; i < 1000; i++) {
            if ((teams[12].sims[i] + Number(teams[12].teamScore)) > (teams[13].sims[i] + Number(teams[13].teamScore))) {
                wins++;
            }
        }
        teams[12].wp = (Math.min(wins / 1000, 0.99));
        teams[13].wp = Number(1 - teams[12].wp);

        console.log('wins: ', wins);
        scoreContent = matchups.map((matchup) => {
            return (
                <div className="p-2" style={{ margin: 'auto', height: '80%', }}>
                    <div style={{width: '100%', display: 'flex'}}>
                    <button type="button" class="btn btn-default btn-sm" style={{color: 'white', margin: 'auto', backgroundColor: 'blue'}} onClick={handleShow}><Calculator size={32}/>Simulate</button>
                            <Modal dialogClassName="my-modal" show={show} onHide={handleClose} fullscreen={true}>
                                <button type="button" class="btn btn-default btn-sm" style={{color: 'white', margin: 'auto', backgroundColor: 'blue'}} onClick={handleClose}><XCircleFill size={32}/>Close</button>
                                <Modal.Body>
                                    <Lineups loaded={loaded} teams={teams} matchups={matchups} refreshFunc={refreshFunc} simulated={true}></Lineups>
                                </Modal.Body>
                            </Modal>
                        <button type="button" class="btn btn-default btn-sm" style={{color: 'white', margin: 'auto', backgroundColor: 'blue'}} onClick={refreshFunc}>
                            <ArrowClockwise size={32}/>Refresh
                        </button>
                    </div>
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
                                        <Col style={{paddingBottom: '5%', fontSize: "x-large"}}>{teams[matchup.homeTeam].teamScore}</Col>
                                        <Col style={{paddingBottom: '5%', fontSize: "x-large"}}>{teams[matchup.awayTeam].teamScore}</Col>
                                    </Row>
                                    <Row>
                                        <Col className="sb-detail" style={{paddingBottom: '5%', fontSize: "medium"}}>Win Probability:<br/> {(teams[matchup.homeTeam].wp*100).toFixed(0) + '%'}</Col>
                                        <Col className="sb-detail" style={{paddingBottom: '5%', fontSize: "medium"}}>Win Probability:<br/> {(teams[matchup.awayTeam].wp*100).toFixed(0) + '%'}</Col>
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