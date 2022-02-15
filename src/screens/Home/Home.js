import React, { useEffect } from 'react';
import './Home.css';
import logo from '../../images/logo.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const navigate = useNavigate();
	useEffect(() => {
		setTimeout(() => {
			navigate('/home');
		}, 4000);
	});

	return (
		<div>
			<div className="intro-screen flex flex-col items-center xs-mobile:ml-10">
				<img src={logo} alt="intro" className="opacity-100 fade-animation" />
			</div>
		</div>
	);
};

export default Home;
