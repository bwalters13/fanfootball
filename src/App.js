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
import sims from './sims.json';
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

const boxMullerTransform = () => {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    
    return { z0, z1 };
}

const getNormallyDistributedRandomNumber = (mean, stddev) => {
    const { z0, _ } = boxMullerTransform();
    
    return z0 * stddev + mean;
}




const leagueInfo = await myClient.getLeagueInfo({ seasonId: 2023 });
const currentWeek = leagueInfo.currentScoringPeriodId;
const currentMatchup = leagueInfo.currentMatchupPeriodId;

console.log(currentMatchup, currentWeek);

const teamInfo = await myClient.getTeamsAtWeek({ seasonId: 2023, scoringPeriodId: 17 });
const oldBoxscore = await myClient.getBoxscoreForWeek({seasonId: 2023, matchupPeriodId: currentMatchup-1, scoringPeriodId: currentWeek-1})

const pastScores = {};

oldBoxscore.forEach((boxscore) => {
    if (relevantTeams.includes(boxscore.homeTeamId)) {
        pastScores[boxscore.homeTeamId] = boxscore.homeWeekly[currentWeek-1];
    } else if (relevantTeams.includes(boxscore.awayTeamId)) {
        pastScores[boxscore.awayTeamId] = boxscore.awayWeekly[currentWeek-1];
    }
});

function filterByInnerObjectKeys(obj, filterKey) {
    let newObj = {}
    Object.entries(obj).forEach(([key, value]) => {
        newObj[key] = value.sims;
    });
    return newObj;
}

console.log(sims);

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
        let boxscores = await myClient.getBoxscoreForWeek({ seasonId: 2023, matchupPeriodId: currentMatchup, scoringPeriodId: currentWeek });
        console.log('boxscores:', boxscores);
        boxscores = boxscores.filter((boxscore) => relevantTeams.includes(boxscore.homeTeamId) || relevantTeams.includes(boxscore.awayTeamId));
        console.log('filtered boxscores:', boxscores)
        boxscores.forEach(boxscore => {
            if (relevantTeams.includes(boxscore.homeTeamId)) {
                let homeTeamInfo = teamInfo.filter((team) => team.id === boxscore.homeTeamId);
                let homeTeam = new Team(boxscore.homeTeamId, boxscore.homeScore, homeTeamInfo[0].name, pastScores[boxscore.homeTeamId], boxscore.homeProjectedScore);
                console.log('homeTeam', homeTeam)
                boxscore.homeRoster.forEach(player => {
                    if (player.rosteredPosition !== 'Bench' && player.rosteredPosition !== 'IR') {
                    // let newPlayer = new Player(player.fullName, player.totalPoints, boxscore.homeTeamId, player.rosteredPosition, player.proTeamAbbreviation, sumValues(player.projectedPointBreakdown), yetToPlay);
                        let newPlayer = new Player(player, boxscore.homeTeamId);
                        homeTeam.addPlayer(newPlayer);
                    }
                });
                homeTeam.sims = sims[boxscore.homeTeamId];
                allTeams[boxscore.homeTeamId] = homeTeam;
            }
            if ('awayTeamId' in boxscore && relevantTeams.includes(boxscore.awayTeamId)) {
                let awayTeamInfo = teamInfo.filter((team) => team.id === boxscore.awayTeamId);
                let awayTeam = new Team(boxscore.awayTeamId, boxscore.awayScore, awayTeamInfo[0].name, pastScores[boxscore.awayTeamId], boxscore.awayProjectedScore);
                boxscore.awayRoster.forEach(player => {
                    if (player.rosteredPosition !== 'Bench' && player.rosteredPosition !== 'IR') {
                        let newPlayer = new Player(player, boxscore.awayTeamId);
                        console.log('player:', player);
                        awayTeam.addPlayer(newPlayer);
                    }
                });
                awayTeam.sims = sims[boxscore.awayTeamId];
                allTeams[boxscore.awayTeamId] = awayTeam;
                
            }

            

            
        });
        setTeams(allTeams);
        setLoaded(true);
    }   

    useEffect(() => {
        async function fetchData() {
            if (!loaded) {
                await loadRosters();
            } else {
                console.log(teams)
                console.log(filterByInnerObjectKeys(teams, 'sims'));
            }
        }

        fetchData();
    })


    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Scoreboard loaded={loaded} teams={teams} matchups={matchups} refreshFunc={loadRosters}/>}/>
                <Route path="/scores" element={<Lineups loaded={loaded} teams={teams} matchups={matchups} refreshFunc={loadRosters}/>}/>
                <Route path="/stats" element={<Stats/>}/>
            </Routes>
        </Router>
    );
    
}

class Team {
    constructor(teamId, score, teamName, pastScore, projectedScore) {
        this.teamScore = Number(score + pastScore).toFixed(2);
        this.teamId = teamId;
        this.teamName = teamName;
        this.teamPlayers = [];
        this.pastScore = pastScore;
        this.projectedScore = Number(projectedScore + pastScore).toFixed(2);
    }

    get ceiling() {
        let _ceiling = 0;
        this.teamPlayers.forEach(player => {
            _ceiling += player.ceiling;
        });
        return _ceiling + this.pastScore;
    }

    get floor () {
        let _floor = 0;
        this.teamPlayers.forEach(player => {
            _floor += player.floor;
        });
        return _floor + this.pastScore;
    }

    // get simScores() {
    //     let _scores = [];
    //     for (let i = 0; i < 1; i++) {
    //         let _score = 0;
    //         this.teamPlayers.forEach(player => {
    //             _score += player.random;
    //         });
    //         _scores.push(_score);
    //     }
    //     return _scores;
    // }

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
        this.playerObj = player;
        this.playerScore = player.totalPoints;
        this.position = player.rosteredPosition === 'RB/WR/TE' ? 'FLEX' : player.rosteredPosition;
        this.team = player.proTeamAbbreviation;
        this.fantasyTeamId = teamId;
        this.projected = Number(sumValues(player.projectedPointBreakdown).toFixed(2));
        this.yetToPlay = !player.locked;
        this.playerId = player.id;
        let ceilingFloor = this.getCeilingFloor(player);
        this.ceiling = ceilingFloor.ceiling;
        this.floor = ceilingFloor.floor;
    }

    get random() {
        let points = 0;
        Object.keys(this.playerObj.projectedRawStats).forEach(stat => {
            let val = 0;
            switch (stat) {
                case 'passingYards':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;    
                    points += val * 0.04;
                    break;
                case 'rushingYards':
                case 'receivingYards':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 0.1;
                    break;
                case 'passingTouchdowns':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 4;
                    break;
                case 'rushingTouchdowns':
                case 'receivingTouchdowns':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 6;
                    break;
                case 'receivingReceptions':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val;
                    break;
                case 'passingInterceptions':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * -2;
                    break;
                case 'passing2PtConversions':
                case 'rushing2PtConversions':
                case 'receiving2PtConversions':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 2;
                    break;
                case 'lostFumbles':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * -2;
                    break;
                case 'defensiveSacks':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val;
                    break;
                case 'defensiveBlockedKickForTouchdowns':
                case 'interceptionReturnTouchdown':
                case 'fumbleReturnTouchdown':
                case 'puntReturnTouchdown':
                case 'kickoffReturnTouchdown':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 6;
                    break;
                case 'defensiveInterceptions':
                case 'defensiveFumbles':
                case 'defensiveSafeties':
                case 'defensiveBlockedKicks':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 2;
                    break;
                
                default:
                    if (stat in this.playerObj.projectedPointBreakdown && stat !== 'usesPoints') {
                        points += this.playerObj.projectedPointBreakdown[stat];
                    }
                    break;
            }
        });
        return points;
    }


    

    getCeilingFloor(player) {
        let ceiling = 0;
        let floor = 0;
        Object.keys(player.projectedRawStats).forEach(stat => {
            switch (stat) {
                case 'passingYards':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 0.04;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 0.04;
                    break;
                case 'rushingYards':
                case 'receivingYards':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 0.1;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 0.1;
                    break;
                case 'passingTouchdowns':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 4;
                    ceiling += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 4;
                    break;
                case 'rushingTouchdowns':
                case 'receivingTouchdowns':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 6;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 6;
                    break;
                case 'receivingReceptions':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]);
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]);
                    break;
                case 'passingInterceptions':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * -2;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * -2;
                    break;
                case 'passing2PtConversions':
                case 'rushing2PtConversions':
                case 'receiving2PtConversions':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 2;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 2;
                    break;
                case 'lostFumbles':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * -2;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * -2;
                    break;
                case 'defensiveSacks':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 1;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 1;
                    break;
                case 'defensiveBlockedKickForTouchdowns':
                case 'interceptionReturnTouchdown':
                case 'fumbleReturnTouchdown':
                case 'puntReturnTouchdown':
                case 'kickoffReturnTouchdown':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 6;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 6; 
                    break;
                case 'defensiveInterceptions':
                case 'defensiveFumbles':
                case 'defensiveSafeties':
                case 'defensiveBlockedKicks':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 2;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 2;
                    break;
                
                default:
                    if (stat in player.projectedPointBreakdown && stat !== 'usesPoints') {
                        ceiling += player.projectedPointBreakdown[stat];
                        floor += player.projectedPointBreakdown[stat];
                    }
                    break;
            }
            
        });
        return {ceiling: ceiling, floor: floor};
    }
}