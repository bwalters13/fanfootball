import MyNavbar from './Navbar.js';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import React, { Component, useEffect, useState } from 'react';
import Papa from 'papaparse';
import teamCSV from './teams.csv';
import { Container } from 'react-bootstrap';

const sortOrder = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'D/ST'];
let data = undefined;
const papaConfig = {
    complete: (results, file) => {
      data = results.data;
    },
    download: true,
    header: true,
    error: (error, file) => {
      console.log('Error while parsing:', error, file);
    },
};
console.log(Papa.parse(teamCSV, papaConfig));

const teamPictures = {
    12: '/img/me.png',
    7: '/img/spence.png',
    14: '/img/shap.png',
    13: '/img/saum.png'
}

const Lineups = ({ loaded, teams, matchups }) => {
    if (!loaded) {
        return (
            <div>
                <MyNavbar/>
            </div>
        )
    }

    console.log('data', data);

    const getMatchupString = (matchup) => {
        let homeTeam = teams[matchup.homeTeam];
        let awayTeam = teams[matchup.awayTeam];
        return homeTeam.teamName + ' vs. ' + awayTeam.teamName;
    }


    return (
        <div>
            <MyNavbar/>
            <Tabs defaultActiveKey="game1" id="uncontrolled-tab-example" className="mb-3" justify="true">
                <Tab eventKey="game1" title={getMatchupString(matchups[0])}>
                    <Game teams={teams} matchup={matchups[0]}/>
                </Tab>
                <Tab eventKey="game2" title={getMatchupString(matchups[1])}>
                    <Game teams={teams} matchup={matchups[1]}/>
                </Tab>
            </Tabs>
        </div>
    );
};

const Game = ({ teams, matchup }) => {

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

    let homeTeam = teams[matchup.homeTeam];
    let awayTeam = teams[matchup.awayTeam];
    let homeStarters = homeTeam.teamPlayers.filter((player) => player.position !== "Bench" && player.position !== "IR");

    const getTeamLogo = (player) => { 
        return <img style={{margin: 'auto'}} src={'/img/' + player.team.toLowerCase() + '.png'} height="30" width="30" ></img>
    }

    const getRowColor = (player) => {
        return data.find((row) => row.team_abbr === player.team).team_color;
    }

    homeStarters.sort((a, b) => {
        return sortOrder.indexOf(a.position) - sortOrder.indexOf(b.position);
    });

    let awayStarters = awayTeam.teamPlayers.filter((player) => player.position !== "Bench" && player.position !== "IR");

    awayStarters.sort((a, b) => {
        return sortOrder.indexOf(a.position) - sortOrder.indexOf(b.position);
    });

    let homePlayerContent = homeStarters.map((player) => {
        return (
            <tr>
                <td style={{backgroundColor: getRowColor(player)}}>{player.position}</td>
                <td style={{backgroundColor: getRowColor(player)}}>{player.playerName}</td>
                <td style={{backgroundColor: getRowColor(player), width: '5vw'}}>{getTeamLogo(player)}</td>
                <td style={{backgroundColor: getRowColor(player)}}>Proj: {player.projected}</td>
                <td style={{backgroundColor: getRowColor(player), textAlign: 'right', paddingRight: '5%'}}>{player.playerScore === 0 ? '-' : player.playerScore.toFixed(2)}</td>
            </tr>
        )
    });

    

    let awayPlayerContent = awayStarters.map((player) => {
        return (
            <tr>
                <td style={{backgroundColor: getRowColor(player)}}>{player.position}</td>
                <td style={{backgroundColor: getRowColor(player)}}>{player.playerName}</td>
                <td style={{backgroundColor: getRowColor(player), width: '5vw'}}>{getTeamLogo(player)}</td>
                <td style={{backgroundColor: getRowColor(player)}}>Proj: {player.projected}</td>
                <td style={{backgroundColor: getRowColor(player), textAlign: 'right', paddingRight: '5%', fontSize: 'medium'}}>{player.playerScore === 0 ? '-' : player.playerScore.toFixed(2)}</td>
            </tr>
        )
    });

    let homeMobilePlayerContent = homeStarters.map((player) => {
        return (
            <tr>
                <td style={{backgroundColor: getRowColor(player)}}>{player.position}</td>
                <td style={{backgroundColor: getRowColor(player)}}>{player.playerName}</td>
                <td style={{backgroundColor: getRowColor(player), width: '5vw'}}>{getTeamLogo(player)}</td>
                {/* <td>{player.projected}</td> */}
                <td style={{textAlign: 'right', backgroundColor: getRowColor(player), paddingRight: player.playerScore === 0 ? '5%' : '1%', fontSize: 'medium'}}>{player.playerScore === 0 ? '-' : player.playerScore.toFixed(2)}</td>
            </tr>
        )
    });

    let awayMobilePlayerContent = awayStarters.map((player) => {
        return (
            <tr>
                <td style={{backgroundColor: getRowColor(player)}}>{player.position}</td>
                <td style={{backgroundColor: getRowColor(player)}}>{player.playerName}</td>
                <td style={{backgroundColor: getRowColor(player), width: '5vw'}}>{getTeamLogo(player)}</td>
                {/* <td>{player.projected}</td> */}
                <td style={{textAlign: 'right', backgroundColor: getRowColor(player), paddingRight: player.playerScore === 0 ? '5%' : '1%', fontSize: 'medium'}}>{player.playerScore === 0 ? '-' : player.playerScore.toFixed(2)}</td>
            </tr>
        )
    });

    const awayTeamFormatted = (team) => { 
        if (awayTeam.teamName === 'Team Jafarinia' & isMobile) {
            return (
                <div>
                    <div className="matchup-team">Team<br/>Jafarinia</div>
                </div>
            )
        }
        return (
            <div>
                <div className="matchup-team">{team.teamName}</div>
            </div>
        )
    }

    const getColumns = (isMobile, team) => {
        if (isMobile) {
            return (
                <div style={{width: '100%', height: '12vh', textAlign: 'center', paddingLeft: '20%'}}>
                    <caption style={{color: 'white', display: 'inline-block'}}>{team.teamName}</caption>
                </div>
            )
        } else {
            return (
                <thead>
                    <tr>
                        <th></th>
                        <th>{team.teamName}</th>
                        <th>Projected</th>
                        <th></th>
                    </tr>
                </thead>
            )
        }
    }

    

    let sz = isMobile ? 'sm' : 'md';
    
    return (
        <Container>
            <div className="top-score">
                <Card bg='dark' text="white" className="teamSum">
                    <Card.Body>
                        <Card.Text>
                            <div className='homeTeam div-sum'>
                                <Row>
                                    <div className="matchup-team">{homeTeam.teamName}</div>
                                </Row>
                                <Row>
                                    <div className="score">{homeTeam.teamScore}</div>
                                </Row>
                            </div>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card bg='dark' text="white" className='teamSum'>
                    <Card.Body>
                        <Card.Text>
                            <div className='awayTeam div-sum'>
                                <Row>
                                    {awayTeamFormatted(awayTeam)}
                                </Row>
                                <Row>
                                    <div className="score">{awayTeam.teamScore}</div>
                                </Row>
                            </div>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <Stack className="lineups" direction="horizontal">
                <div className="mx-auto teamTable">
                    <Table variant="dark" size={sz}>
                        {/* {getColumns(isMobile, homeTeam)} */}
                        <tbody>{isMobile ? homeMobilePlayerContent : homePlayerContent}</tbody>
                    </Table>
                </div>
                <div className="mx-auto teamTable" >
                    <Table variant="dark" size={sz}>
                        {/* {getColumns(isMobile, awayTeam)} */}
                        <tbody>
                            {isMobile ? awayMobilePlayerContent : awayPlayerContent}
                        </tbody>
                    </Table>
                </div>
            </Stack>
        </Container>
    );
}
 
export default Lineups;
