import React, { useState, useEffect, useContext } from 'react';
import FlashCard from '../../../components/Flashcard/Flashcard';
import './Scoreboard.css';
import Scores from '../../../components/Scores/Scores';
import { set, ref, update, get, child, onValue } from 'firebase/database';
import { database as db } from '../../../firebase';
import { CodeContext, UserContext } from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import useFirebaseRef from '../../../components/useFirebaseRef';

const Scoreboard = () => {
	const navigate = useNavigate();
	const { code } = useContext(CodeContext);
	// const [scoreData, setScores] = useState([]);
	// const [playerData, setPlayers] = useState([]);
	const [playerData, loading] = useFirebaseRef(`sessions/${code}/users`);
	const [scoreData, loading1] = useFirebaseRef(`sessionData/${code}/state`);
	const [hostProperties, loading2] = useFirebaseRef(
		`sessionData/${code}/hostProperties`
	);
	const [show, setShow] = useState(false);
	/* const getPlayers = () => {
		get(child(ref(db), `sessions/${code}/users`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					const data = Object.values(snapshot.val());
					console.log(data);
					setPlayers(data);
				} else {
					console.log('No data available');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}; */
	/* const getPlayersData = () => {
		onValue(ref(db, `sessionData/${code}/state`), (snapshot) => {
			console.log(`sessionData/${code}/state`);
			//  console.log(snapshot.val());
			const data = Object.values(snapshot.val());
			console.log(data);
			setScores(data);
		});
	}; */
	const waitingRoom = () => {
		if (hostProperties && hostProperties.movetoWaitingRoom) {
			console.log('move to waitin');
			navigate('/waiting');
		}
	};
	useEffect(() => {
		console.log(playerData);
		console.log(scoreData);
		if (!loading2) waitingRoom();
	}, [loading2, hostProperties]);
	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="md:w-96 xs-mobile:w-9/12">
				<FlashCard text={`Scores`} />
			</div>
			<div className="tables flex flex-row justify-center self-center xs-mobile:w-full md:w-5/6 ml-auto mrs-auto overflow-y-auto">
				{scoreData && playerData && !loading && !loading1 ? (
					<Scores show={show} scores={scoreData} players={playerData} />
				) : null}
			</div>
		</div>
	);
};

export default Scoreboard;
