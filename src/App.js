import logo from './logo.svg';
import './App.css';
import React, { Component, useEffect, useState } from 'react';
import { Client } from 'espn-fantasy-football-api';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Navbar from 'react-bootstrap/Navbar';
import Scoreboard from './Scoreboard.js';
import Lineups from './lineups.js';
import Stats from './Stats.js';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

const s2 = 'AEBLbPeWIC61WxXB2%2F0rCLG2Lc2MPBG9bd6kCKAEfGZo3IOR%2Fjxv6sZqmsko9aieZnxqrxbDTK1%2BFCzmj1%2BfVNNTTlbTGQwl0gyLHmUG3NzpB0tRPMQMNtmuOyTeXvKMXjHR6MYsUo%2F9Urv8YVKWM7N4X%2FTyuzJpt2FC%2BR8b5ybw3KhoynFrwDP8y0RmAno4UgsgUBOnvWp2v8g91VCkkNlTKDzjO6tUcovif%2FMmyOOUUVYMXmPboQmMwzSrEKP2BTFS4PvUTTDEMfy3Kxw6gEEF';
const swid = '{C0029F35-8FC0-4E99-B1F3-74350A1A393F}';

const matchups = [
    {homeTeam: 12, awayTeam: 13}
]


const relevantTeams = [ 12, 13 ];

const myClient = new Client({ 
    leagueId: 1194235,
    // Cookies acquired by logging into ESPN account
    espnS2: s2,
    SWID: swid,
});

const currentWeek = 16;

const teamInfo = await myClient.getTeamsAtWeek({ seasonId: 2023, scoringPeriodId: 16 });
const oldBoxscore = await myClient.getBoxscoreForWeek({seasonId: 2023, matchupPeriodId: 14, scoringPeriodId: currentWeek-1})

const pastScores = {};

oldBoxscore.forEach((boxscore) => {
    if (relevantTeams.includes(boxscore.homeTeamId)) {
        pastScores[boxscore.homeTeamId] = boxscore.homeWeekly[15];
    } else if (relevantTeams.includes(boxscore.awayTeamId)) {
        pastScores[boxscore.awayTeamId] = boxscore.awayWeekly[15];
    }
});

console.log(pastScores);
console.log(teamInfo)

const sumValues = obj => {
    if (obj === undefined) {
        return 0;
    }
    return ( Object.values(obj).reduce((a, b) => a + b)) - 1;
}


export default function App() {
    const [teams, setTeams] = useState([]);
    const [loaded, setLoaded] = useState(false);

        // scoreContent = teams.map((team) => {
        //     return (
        //         <div style={{float: 'left', width: '25%', height: '50%'}}>
        //             <Card style={{height: '100%'}} data-bs-theme="dark">
        //                 <Card.Body>
        //                     {matchups.map((matchup) => {
        //                         <Card.Title>{matchup.homeTeam} vs. {matchup.awayTeam}</Card.Title>
        //                         <Card.Text></Card.Text>
        //                     })}
        //                     <Card.Text>
        //                         {team.teamPlayers.map((player) => {
        //                             return (
        //                                 <div>
        //                                     {player.playerName} {player.position}
        //                                 </div>
        //                             )
        //                         })}
        //                     </Card.Text>
        //                 </Card.Body>
        //             </Card>
        //         </div>

                // <div style={{float: 'left', width: '25%'}}>
                //     <h1>{team.teamId}</h1>
                //     <h2>{team.teamName}</h2>
                //     <ul>
                //         {team.teamPlayers.map((player) => {
                //             return (
                //                 <li>
                //                     {player.playerName} - {player.playerScore}
                //                 </li>
                //             )
                //         })}
                //     </ul>
                // </div>

    const loadRosters = async() => {
        const allTeams = {};
        let boxscores = await myClient.getBoxscoreForWeek({ seasonId: 2023, matchupPeriodId: 14, scoringPeriodId: currentWeek });
        console.log('boxscores:', boxscores);
        boxscores = boxscores.filter((boxscore) => relevantTeams.includes(boxscore.homeTeamId) || relevantTeams.includes(boxscore.awayTeamId));
        console.log('filtered boxscores:', boxscores)
        boxscores.forEach(boxscore => {
            if (relevantTeams.includes(boxscore.homeTeamId)) {
                let homeTeamInfo = teamInfo.filter((team) => team.id === boxscore.homeTeamId);
                let homeTeam = new Team(boxscore.homeTeamId, boxscore.homeScore, homeTeamInfo[0].name, boxscore.homeWeekly[15], boxscore.homeProjectedScore);
                console.log('homeTeam', homeTeam)
                boxscore.homeRoster.forEach(player => {
                    // let newPlayer = new Player(player.fullName, player.totalPoints, boxscore.homeTeamId, player.rosteredPosition, player.proTeamAbbreviation, sumValues(player.projectedPointBreakdown), yetToPlay);
                    let newPlayer = new Player(player, boxscore.homeTeamId);
                    homeTeam.addPlayer(newPlayer);
                });
                allTeams[boxscore.homeTeamId] = homeTeam;
            }
            if ('awayTeamId' in boxscore && relevantTeams.includes(boxscore.awayTeamId)) {
                let awayTeamInfo = teamInfo.filter((team) => team.id === boxscore.awayTeamId);
                let awayTeam = new Team(boxscore.awayTeamId, boxscore.awayScore, awayTeamInfo[0].name, boxscore.awayWeekly[15], boxscore.awayProjectedScore);
                boxscore.awayRoster.forEach(player => {
                    let newPlayer = new Player(player, boxscore.awayTeamId);
                    awayTeam.addPlayer(newPlayer);
                });
                allTeams[boxscore.awayTeamId] = awayTeam;
            }

            
        });
        setTeams(allTeams);
        setLoaded(true);
        console.log(teams);
    }   

    useEffect(() => {
        async function fetchData() {
            if (!loaded) {
                await loadRosters();
                console.log(teams);
            } else {
                console.log(teams)
            }
        }

        fetchData();
    })


    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Scoreboard loaded={loaded} teams={teams} matchups={matchups}/>}/>
                <Route path="/scores" element={<Lineups loaded={loaded} teams={teams} matchups={matchups}/>}/>
                <Route path="/stats" element={<Stats/>}/>
            </Routes>
        </Router>
    );
    
}

class Team {
    constructor(teamId, score, teamName, pastScore, projectedScore) {
        this.teamScore = Number(score - pastScore).toFixed(2);
        this.teamId = teamId;
        this.teamName = teamName;
        this.teamPlayers = [];
        this.pastScore = pastScore;
        this.projectedScore = Number(projectedScore - pastScore).toFixed(2);
    }

    // get teamScore() {
    //     let _score = 0;
    //     this.teamPlayers.forEach(player => {
    //         if (player.position !== "Bench") {
    //             _score += player.playerScore;
    //         }
    //     });
    //     return _score.toFixed(2);
    // }

    // get projectedScore() {
    //     let _score = 0;
    //     this.teamPlayers.forEach(player => {
    //         if (player.position !== "Bench") {
    //             _score += player.projected;
    //         }
    //     });
    //     return _score.toFixed(2);
    // }

    get playersYetToPlay() {
        let _count = 0;
        this.teamPlayers.forEach(player => {
            if (player.yetToPlay && player.position !== "Bench" && player.position !== "IR") {
                _count += 1;
            }
        });
        return _count;
    }

    

    addPlayer(player) {
        this.teamPlayers.push(player);
    }
}

class Player {
    constructor(player, teamId) {
        this.playerName = player.fullName;
        this.playerScore = player.totalPoints;
        this.position = player.rosteredPosition === 'RB/WR/TE' ? 'FLEX' : player.rosteredPosition;
        this.team = player.proTeamAbbreviation;
        this.fantasyTeamId = teamId;
        this.projected = Number(sumValues(player.projectedPointBreakdown).toFixed(2));
        this.yetToPlay = !player.locked;
        this.playerId = player.id;
    }
}