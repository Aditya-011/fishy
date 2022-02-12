import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import FlashCard from '../../../components/Flashcard/Flashcard';
import Icons from '../../../components/Icons/Icons';
import Scores from '../../../components/Scores/Scores';
import Button from '../../../components/Button/Button';

import './Scoreboard.css';

import { CodeContext, UserContext } from '../../../context/context';

import { set, ref, update, get, child, onValue } from 'firebase/database';
import { database as db } from '../../../firebase';
import useFirebaseRef from '../../../components/useFirebaseRef';

const Scoreboard = () => {
	const { code } = useContext(CodeContext);
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	// const [scoreData, setScores] = useState([]);
	// const [playerData, setPlayers] = useState([]);
	const [playerData, loading] = useFirebaseRef(`sessions/${code}/users`);
	const [scoreData, loading1] = useFirebaseRef(`sessionData/${code}/state`);
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
		const starCountRef = ref(db, `sessionData/${code}/hostProperties`);
		onValue(starCountRef, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
		});
	};
	const clickHandler = () => {
		setShow(!show);
	};

	useEffect(() => {
		console.log(playerData);
		console.log(scoreData);
	}, []);

	const clickHandler2 = () => {
		get(child(ref(db), `sessionData/${code}/hostProperties`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					// console.log(snapshot.val());
					const res = snapshot.val();
					const updates = {};
					updates[`sessionData/${code}/hostProperties`] = {
						...res,
						movetoWaitingRoom: true,
					};
					update(ref(db), updates);
					if (res.isOver) {
						navigate(`/waiting`);
					}
				} else {
					console.log('No data available');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="md:w-96 xs-mobile:w-9/12">
				<FlashCard text={`Scores`} />
			</div>
			<div className="tables flex justify-center self-center xs-mobile:w-full md:w-5/6 ml-auto mr-auto overflow-y-auto">
				<div className="show-hidden-table">
					<Icons
						icon={
							show
								? `https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-new.png`
								: `https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-off-new.png`
						}
						clickHandler={clickHandler}
					/>
				</div>
				{playerData && !loading && scoreData && !loading1 ? (
					<Scores show={show} scores={scoreData} players={playerData} />
				) : //   console.log(playerData, scoreData)
				null}
			</div>
			{!loading ? (
				<Link
					to={{
						pathname: `/waiting`,
						state: {
							value: { playerData },
						},
					}}
				>
					<Button
						text={'Next Round'}
						display={'bg-btn-bg-primary bg-center p-3 mt-2 btn-lg'}
						clickHandler={() => clickHandler2()}
					/>
				</Link>
			) : null}
		</div>
	);
};

export default Scoreboard;
