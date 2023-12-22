import React from 'react';
import MyNavbar from './Navbar.js';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import './Stats.css';

export default function Stats({}) {
    return (
        <div>
            <MyNavbar/>
            <Tabs defaultActiveKey="troll" className="mb-3" fill={true} variant='pills' style={{paddingTop: '2%'}}>
                <Tab eventKey="troll" title="Spencer was the most trolled plot" className='troll'>
                    <div>
                        <img src="/img/troll_plot.png" className="plot"></img>
                    </div>
                </Tab>
                <Tab eventKey="troll_index" title="Spencer was the most trolled">
                    <img src="/img/troll_index.png" className="plot"></img>
                </Tab>
                <Tab eventKey="best_ball" title="Best Ball Standings">
                    <h3 style={{color: 'white', width: '80%', margin: 'auto', paddingBottom: '5%'}}>Standings with best players automatically set for each game</h3>
                    <img src="/img/opt_standings.png" className="plot"></img>
                </Tab>
                <Tab eventKey="no_k" title="Standings w/ No Kickers">
                    <img src="/img/no_kicker.png" className="plot"></img>
                </Tab>
                <Tab eventKey="ia" title="Most Inactives">
                    <img src="/img/inactives.png" className="plot"></img>
                </Tab>
                <Tab eventKey="draft" title="Points By Drafted Players">
                    <img src="/img/draft.png" className="plot"></img>
                </Tab>
            </Tabs>
        </div>
    )
}