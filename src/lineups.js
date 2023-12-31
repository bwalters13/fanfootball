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
import { ArrowClockwise } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';

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

const Lineups = ({ loaded, teams, matchups, refreshFunc, simulated }) => {
    if (!loaded) {
        return (
            <div>
                <MyNavbar/>
            </div>
        )
    }


    const getMatchupString = (matchup) => {
        let homeTeam = teams[matchup.homeTeam];
        let awayTeam = teams[matchup.awayTeam];
        return homeTeam.teamName + ' vs. ' + awayTeam.teamName;
    }

    if (simulated) {
        return (
            <Game teams={teams} matchup={matchups[0]} refreshFunc={refreshFunc} simulated={simulated}/>
        )
    }


    return (
        <div>
            <MyNavbar/>
            <Tabs defaultActiveKey="game1" id="uncontrolled-tab-example" className="mb-3" justify="true">
                <Tab eventKey="game1" title={getMatchupString(matchups[0])}>
                    <Game teams={teams} matchup={matchups[0]} refreshFunc={refreshFunc} simulated={simulated}/>
                </Tab>
            </Tabs>
        </div>
    );
};

const Game = ({ teams, matchup, refreshFunc, simulated }) => {
    
    console.log(teams);
    if (simulated) {

    }
    const [width, setWidth] = useState(window.innerWidth);
    const [seed, setSeed] = useState(0);

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
    console.log(homeTeam.ceiling, homeTeam.floor);

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

    const getUrl = (player) => {
        if (player.position === 'D/ST') {
            return '/img/' + player.team.toLowerCase() + '.png';
        }
        return "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/" + player.playerId + ".png&w=350&h=254";
    }

    let homePlayerContent = homeStarters.map((player) => {
        return (
            <tr style={{height: '3vw'}}>
                <td style={{backgroundColor: getRowColor(player), width: '2vw'}}>{player.position}</td>
                <td style={{backgroundColor: getRowColor(player), width: '3vw', }}><img src={getUrl(player)} width="35" height="24"/></td>
                <td style={{backgroundColor: getRowColor(player)}}>{player.playerName}</td>
                <td style={{backgroundColor: getRowColor(player), width: '5vw'}}>{getTeamLogo(player)}</td>
                <td style={{backgroundColor: getRowColor(player)}}>Proj: {player.projected}</td>
                <td style={{backgroundColor: getRowColor(player), textAlign: 'right', paddingRight: '5%', fontSize: 'medium'}}>{player.playerScore === 0 ? '-' : player.playerScore.toFixed(2)}</td>
            </tr>
        )
    });

    

    let awayPlayerContent = awayStarters.map((player) => {
        return (
            <tr style={{height : '3vw'}}>
                <td style={{backgroundColor: getRowColor(player), width: '2vw'}}>{player.position}</td>
                <td style={{backgroundColor: getRowColor(player), width: '3vw'}}><img src={getUrl(player)} width="35" height="24" style={{margin: 'auto'}}/></td>
                <td style={{backgroundColor: getRowColor(player)}}>{player.playerName}</td>
                <td style={{backgroundColor: getRowColor(player), width: '5vw'}}>{getTeamLogo(player)}</td>
                <td style={{backgroundColor: getRowColor(player)}}>Proj: {player.projected}</td>
                <td style={{backgroundColor: getRowColor(player), textAlign: 'right', paddingRight: '5%', fontSize: 'medium'}}>{player.playerScore === 0 ? '-' : player.playerScore.toFixed(2)}</td>
            </tr>
        )
    });

    let homeMobilePlayerContent = homeStarters.map((player) => {
        return (
            <tr style={{backgroundColor: getRowColor(player), }}>
                <td style={{backgroundColor: getRowColor(player), fontSize: 'small', width: '0px'}}>{player.position}</td>
                <td style={{backgroundColor: getRowColor(player), verticalAlign: 'middle', width: '9vw'}}><img src={getUrl(player)} width="35" height="25.4" style={{marginLeft: '-25%'}}/></td>
                <td style={{backgroundColor: getRowColor(player), verticalAlign: 'middle', width: '14vw', fontSize: player.playerName != 'Commanders D/ST' ? 'small' : 'smaller'}}>{player.playerName}</td>
                <td style={{backgroundColor: getRowColor(player), verticalAlign: 'middle'}}>{getTeamLogo(player)}</td>
                {/* <td>{player.projected}</td> */}
                <td 
                    style={{verticalAlign: 'middle', textAlign: 'right', backgroundColor: getRowColor(player), paddingRight: '2%', fontSize: 'medium', width: '15vw'}}>
                    {player.playerScore === 0 ? '-' : player.playerScore.toFixed(2)}<br></br><div style={{display: player.playerScore == 0 ? 'inline' : 'none', fontSize: 'x-small', textAlign: 'right'}}>Proj: {player.projected}</div>
                </td>
            </tr>
        )
    });

    let awayMobilePlayerContent = awayStarters.map((player) => {
        return (
            <tr style={{backgroundColor: getRowColor(player), }}>
                <td style={{backgroundColor: getRowColor(player), fontSize: 'small', width: '0px'}}>{player.position}</td>
                <td style={{backgroundColor: getRowColor(player), verticalAlign: 'middle', width: '9vw'}}><img src={getUrl(player)} width="35" height="25.4" style={{marginLeft: '-25%'}}/></td>
                <td style={{backgroundColor: getRowColor(player), verticalAlign: 'middle', width: '14vw', fontSize: player.playerName != 'Commanders D/ST' ? 'small' : 'x-small'}}>{player.playerName}</td>
                <td style={{backgroundColor: getRowColor(player), verticalAlign: 'middle'}}>{getTeamLogo(player)}</td>
                {/* <td>{player.projected}</td> */}
                <td 
                    style={{verticalAlign: 'middle', textAlign: 'right', backgroundColor: getRowColor(player), paddingRight: '2%', fontSize: 'medium', width: '15vw'}}>
                    {player.playerScore === 0 ? '-' : player.playerScore.toFixed(2)}<br></br><div style={{display: player.playerScore == 0 ? 'inline' : 'none', fontSize: 'x-small', textAlign: 'right'}}>Proj: {player.projected}</div>
                </td>
            </tr>
        )
    });

    const awayTeamFormatted = (team) => { 
        if (!isMobile) {
            return (
                <div>
                    <div className="matchup-team">{team.teamName}</div>
                </div>
            )
        }
        if (team.teamName === 'Team Jafarinia' & isMobile) {
            return (
                <div>
                    <div className="matchup-team">Team<br/>Jafarinia</div>
                </div>
            )
        } else if (team.teamName === 'The Rise of SkyyWalker') { 
            return (
                <div>
                    <div className="matchup-team">The Rise of<br/> Skyywalker</div>
                </div>
            )
        } else if (team.teamName === 'Rushin Disinformation ') {
            return (
                <div>
                    <div className="matchup-team">Rushin<br/>Disinformation</div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className="matchup-team">Super Ja'Marrio<br/>Brothers</div>
                </div>
            )
        }
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

    let [clickCount, setClickCount] = useState(0);

    const simulate = () => {
        let homeScore = 0;
        let awayScore = 0;
        homeStarters.forEach((player) => {
            player.playerScore = player.random;
            homeScore += player.playerScore;
        });
        awayStarters.forEach((player) => {
            player.playerScore = player.random;
            awayScore += player.playerScore;
        });
        homeTeam.teamScore = (homeScore + homeTeam.pastScore).toFixed(2);
        awayTeam.teamScore = (awayScore + awayTeam.pastScore).toFixed(2);
        console.log(homeScore);
        // setSeed(Math.random());
        setClickCount(clickCount + 1);
        simulated = true;
    }

    let backgroundAway = 'dark';
    let backgroundHome = 'dark';
    let gotSimScores = false;

    if (simulated && !gotSimScores) {
        // simulate();
        backgroundHome = homeTeam.teamScore > awayTeam.teamScore ? 'success' : 'danger';
        backgroundAway = awayTeam.teamScore > homeTeam.teamScore ? 'success' : 'danger';
        gotSimScores = true;
    }



    

    let sz = isMobile ? 'sm' : 'md';
    
    return (
        <Container>
            <div className="top-score">
                <div style={{width: '100%',display: 'flex', justifyContent: 'space-around'}}>
                    <Button variant="primary" onClick={simulate}>{clickCount === 0 ? 'Simulate Matchup' : 'Re-Simulate'}</Button>
                    <button type="button" class="btn btn-default btn-sm" style={{color: 'white', margin: 'auto', backgroundColor: 'rgb(13, 110, 253)', display: simulated === true ? 'none' : 'block'}} onClick={refreshFunc}>
                        <ArrowClockwise title="refresh" size={32}/>Refresh
                    </button>
                    <Button variant="primary" onClick={refreshFunc} style={{display: simulated === true ? 'none' : 'block'}}>Reset Scores</Button></div>
                <Card bg={backgroundHome} text="white" className="teamSum" style={{backgroundColor: 'red'}}>
                    <Card.Body>
                        <Card.Text>
                            <div className='homeTeam div-sum'>
                                <Row>
                                    {awayTeamFormatted(homeTeam)}
                                </Row>
                                <Row>
                                    <div className="score">{homeTeam.teamScore}</div>
                                    <div class="proj-card">Proj: {homeTeam.projectedScore}</div>
                                </Row>
                                <Row>
                                    <div class="proj-card" style={{display: 'inline-block'}}><span style={{marginRight: '10%'}}>Floor: {homeTeam.floor.toFixed(2)}</span> <span>Ceiling: {homeTeam.ceiling.toFixed(2)}</span></div>
                                </Row>
                            </div>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card bg={backgroundAway} text="white" className='teamSum'>
                    <Card.Body>
                        <Card.Text>
                            <div className='awayTeam div-sum'>
                                <Row>
                                    {awayTeamFormatted(awayTeam)}
                                </Row>
                                <Row>
                                    <div className="score">{awayTeam.teamScore}</div>
                                    <div class="proj-card" style={{}}>Proj: {awayTeam.projectedScore}</div>
                                </Row>
                                <Row>
                                    <div class="proj-card" style={{display: 'inline-block'}}><span style={{marginRight: '10%'}}>Floor: {awayTeam.floor.toFixed(2)}</span> <span>Ceiling: {awayTeam.ceiling.toFixed(2)}</span></div>
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
