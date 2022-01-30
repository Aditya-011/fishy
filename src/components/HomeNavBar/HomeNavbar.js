import React from 'react'
import './HomeNavbar.css'
import PlayerScreen from '../../screens/Player/PlayerScreen/PlayerScreen';
import Tab from 'react-bootstrap/Tab'
import HostScreen from '../../screens/Host/HostScreen/HostScreen';
import NavComponent from '../NavComponent';
const HomeNavbar = () => {
    
    return (
        <NavComponent ekey = {'home'}>
                <Tab eventKey="home" title="Join" tabClassName = 'w-100'>
                    <PlayerScreen />
                </Tab>
                <Tab eventKey="profile" title="Host" tabClassName = 'w-100 flex-grow-1'>
                <HostScreen />
                </Tab>
        </NavComponent>
    )
}

export default HomeNavbar
