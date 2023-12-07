import MyNavbar from './Navbar.js';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { Component, useEffect, useState } from 'react';

const sortOrder = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'D/ST'];

const Lineups = ({ loaded, teams, matchups }) => {
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
                <td>{player.position}</td>
                <td>{player.playerName}</td>
                <td>{player.projected}</td>
                <td>{player.playerScore}</td>
            </tr>
        )
    });

    let awayPlayerContent = awayStarters.map((player) => {
        return (
            <tr>
                <td>{player.position}</td>
                <td>{player.playerName}</td>
                <td>{player.projected}</td>
                <td>{player.playerScore}</td>
            </tr>
        )
    });

    let homeMobilePlayerContent = homeStarters.map((player) => {
        return (
            <tr>
                <td>{player.position}</td>
                <td>{player.playerName}</td>
                {/* <td>{player.projected}</td> */}
                <td style={{textAlign: 'center'}}>{player.playerScore}</td>
            </tr>
        )
    });

    let awayMobilePlayerContent = awayStarters.map((player) => {
        return (
            <tr>
                <td>{player.position}</td>
                <td>{player.playerName}</td>
                {/* <td>{player.projected}</td> */}
                <td style={{textAlign: 'center'}}>{player.playerScore}</td>
            </tr>
        )
    });

    const getColumns = (isMobile, team) => {
        if (isMobile) {
            return (
                <thead style={{height: "10vh"}}>
                    <tr>
                        <th></th>
                        <th style={{verticalAlign: 'center'}} className="ms-auto">{team.teamName}</th>
                        {/* <th>Projected</th> */}
                        <th style={{fontSize: 'medium'}}>{team.teamScore}</th>
                    </tr>
                </thead>
            )
        } else {
            return (
                <thead>
                    <tr>
                        <th></th>
                        <th>{team.teamName}</th>
                        <th>Projected</th>
                        <th>{team.teamScore}</th>
                    </tr>
                </thead>
            )
        }
    }

    let sz = isMobile ? 'sm' : 'md';
    
    return (
        <Stack className="lineups" direction="horizontal">
            <div className="mx-auto teamTable">
                <Table striped variant="dark" size={sz}>
                    {getColumns(isMobile, homeTeam)}
                    <tbody>{isMobile ? homeMobilePlayerContent : homePlayerContent}</tbody>
                </Table>
            </div>
            <div className="mx-auto teamTable" >
                <Table striped variant="dark" size={sz}>
                    {getColumns(isMobile, awayTeam)}
                    <tbody>
                        {isMobile ? awayMobilePlayerContent : awayPlayerContent}
                    </tbody>
                </Table>
            </div>
        </Stack>
    );
}
 
export default Lineups;