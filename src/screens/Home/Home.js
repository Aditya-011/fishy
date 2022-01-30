import React, {useEffect} from 'react'
import './Home.css'
import logo from '../../images/logo.png'
const Home = () => {

    useEffect(() => {
        setTimeout(() => {
            window.location.href = '/game'
        }, 4000);
    })
    
    return (
        <div>
            <div className="intro-screen flex flex-col items-center xs-mobile:ml-10">
                <img
            src={logo}
            alt="intro"
            className="opacity-100 fade-animation"
                />
            </div>
        </div>
    )
}

export default Home
