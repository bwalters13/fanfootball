import React, {useState} from 'react';
import MyNavbar from './Navbar.js';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './Stats.css';

export default function Stats({}) {
    const [plot, setPlot] = useState('troll_plot');
    const [title, setTitle] = useState('Spencer was the most trolled plot');
    let handleClick = (e) => {
        console.log(e);
        setPlot(e.target.id);
        setTitle(e.target.innerText);    
    }

    let openFullscreen = () => {
        document.getElementById('plot')?.requestFullscreen();
    }    
    return (
        <div>
            <MyNavbar/>
            {/* <Tabs defaultActiveKey="troll" className="mb-3" fill={true} variant='pills' style={{paddingTop: '2%'}}>
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
                <Tab eventKey="round" title="Quarters Played By Round">
                    <img src="/img/quarters.png" className="plot"></img>
                </Tab>
                <Tab eventKey="drive" title="Drives Played By Round">
                    <img src="/img/drives.png" className="plot"></img>
                </Tab>
                <Tab eventKey="plays" title="Plays Played By Round">
                    <img src="/img/plays.png" className="plot"></img>
                </Tab>

            </Tabs> */}
            <DropdownButton id="dropdown-item-button" title={title}>
                <Dropdown.Item id="troll_plot" as="button" onClick={handleClick}>Spencer was the most trolled plot</Dropdown.Item>
                <Dropdown.Item id="troll_index" as="button" onClick={handleClick}>Spencer was the most trolled</Dropdown.Item>
                <Dropdown.Item id="quarters" as="button" onClick={handleClick}>Quarters Played By Round</Dropdown.Item>
                <Dropdown.Item id="drives" as="button" onClick={handleClick}>Drives Played By Round</Dropdown.Item>
                <Dropdown.Item id="plays" as="button" onClick={handleClick}>Plays Played By Round</Dropdown.Item>
                <Dropdown.Item id="opt_standings" as="button" onClick={handleClick}>Best Ball Standings</Dropdown.Item>
                <Dropdown.Item id="no_kicker" as="button" onClick={handleClick}>Standings w/ No Kickers</Dropdown.Item>
                <Dropdown.Item id="inactives" as="button" onClick={handleClick}>Most Inactives</Dropdown.Item>
                <Dropdown.Item id="draft" as="button" onClick={handleClick}>Points By Drafted Players</Dropdown.Item>
            </DropdownButton>
            <img src={"/img/" + plot + ".png"} className="plot" onClick={openFullscreen}></img>
        </div>
    )
}