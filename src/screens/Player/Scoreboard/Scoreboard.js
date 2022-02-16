import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import FlashCard from '../../../components/Flashcard/Flashcard';
import Scores from '../../../components/Scores/Scores';

import './Scoreboard.css';

import { CodeContext } from '../../../context/context';

import useFirebaseRef from '../../../hooks/useFirebaseRef';
import { calculateScore } from '../../../utils/scoreHelper';

const Scoreboard = () => {
	const navigate = useNavigate();
	const { roomId } = useParams();
	// const { code } = useContext(CodeContext);
	const [playerData, loading] = useFirebaseRef(`sessions/${roomId}/users`);
	const [scoreData, loading1] = useFirebaseRef(
		`sessionData/${roomId}/state`,
		true
	);
	const [hostProperties, loading2] = useFirebaseRef(
		`sessionData/${roomId}/hostProperties`
	);
	const [show, setShow] = useState(false);

	const waitingRoom = () => {
		if (hostProperties && hostProperties.movetoWaitingRoom) {
			console.log('move to waitin');
			navigate(`/game/${roomId}/waiting`);
		}
	};
	useEffect(() => {
		console.log(playerData);
		console.log(scoreData);
		waitingRoom();
	}, [loading2, hostProperties]);
	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="md:w-96 xs-mobile:w-9/12">
				<FlashCard text={`Scores`} />
			</div>
			<div className="tables flex flex-row justify-center self-center xs-mobile:w-full md:w-5/6 ml-auto mrs-auto overflow-y-auto">
				{scoreData && playerData && !loading && !loading1 ? (
					<Scores
						show={show}
						scores={calculateScore(scoreData)}
						players={playerData}
					/>
				) : null}
			</div>
		</div>
	);
};

export default Scoreboard;
