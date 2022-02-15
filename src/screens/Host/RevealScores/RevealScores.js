import React, { useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import FlashCard from '../../../components/Flashcard/Flashcard';
import Icons from '../../../components/Icons/Icons';
import DeckIcons from '../../../components/DeckIcons/DeckIcons';
import Button from '../../../components/Button/Button';
import ShowOptions from '../ShowOptions/ShowOptions';

import Fish1 from '../../../images/Fish1-new.png';
import Fish2 from '../../../images/Fish2-new.png';
import './RevealScores.css';

import { ref, update, get, child } from 'firebase/database';
import { database as db } from '../../../firebase';
import { CodeContext } from '../../../context/context';
import useFirebaseRef from '../../../utils/useFirebaseRef';

const RevealScores = () => {
	const { roomId, id } = useParams();
	// const { code } = useContext(CodeContext);
	const [players, loading] = useFirebaseRef(
		`sessionData/${roomId}/state/${id}`
	);

	const clickHandler = (uId) => {
		console.log(uId);
		const dbRef = ref(db);
		get(child(dbRef, `sessionData/${roomId}/state/${id}/${uId}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					console.log(snapshot.val());
					const res = snapshot.val();
					const updates = {};
					updates[`sessionData/${roomId}/state/${id}/${uId}`] = {
						...res,
						eye: !res.eye,
					};
					update(ref(db), updates);
				} else {
					console.log('No data available');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	useEffect(() => {
		console.log(players);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center pt-1 h-screen reveal">
			<div className="md:w-96 xs-mobile:w-9/12">
				<FlashCard text={`Day ${id}`} />
			</div>
			<div className="flex mt-4 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center">
				{!loading &&
					players &&
					Object.values(players).map((player, index) => {
						console.log(`${player.name} ${Object.keys(players)[index]}`);
						if (player.eye) {
							return (
								<div className="inner-div flex flex-col md:p-1" key={index}>
									<div className="xs-mobile:w-4/6 mobile:w-full w-full self-center ml-auto mr-auto">
										<FlashCard text={player.name} />
									</div>
									{player.eye ? (
										<div key={index} className="">
											<Icons
												icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-new.png`}
												title={'Show'}
												clickHandler={() =>
													clickHandler(Object.keys(players)[index])
												}
											/>
										</div>
									) : (
										<div key={index} className="">
											<Icons
												icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-off-new.png`}
												title={'Hide'}
												clickHandler={() =>
													clickHandler(Object.keys(players)[index])
												}
											/>
										</div>
									)}
									{Number(player.isSubmit.choice) === 1 ? (
										<div className="xs-mobile:ml-auto xs-mobile:mr-auto mt-3">
											<ShowOptions fishes={Fish1} />
										</div>
									) : (
										<div className="xs-mobile:ml-auto xs-mobile:mr-auto mt-3">
											<ShowOptions fishes={Fish2} />
										</div>
									)}
								</div>
							);
						} else {
							return (
								<div key={index} className="inner-div flex flex-col md:p-1">
									<div>
										<FlashCard text={player.name} />
										<Icons
											icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-off-new.png`}
											clickHandler={() =>
												clickHandler(Object.keys(players)[index])
											}
										/>
									</div>
									<div className="mt-3 xs-mobile:ml-auto xs-mobile:mr-auto">
										<ShowOptions />
									</div>
								</div>
							);
						}
					})}
			</div>
			<Link to={`/game/${roomId}/host/scores`}>
				{' '}
				<Button
					text={'Scores'}
					display={'bg-btn-bg-primary bg-center btn-lg mt-3'}
					clickHandler={() => {
						get(child(ref(db), `sessionData/${roomId}/hostProperties`))
							.then((snapshot) => {
								if (snapshot.exists()) {
									const res = snapshot.val();
									console.log(res);
									const updates = {};
									updates[`sessionData/${roomId}/hostProperties`] = {
										...res,
										showScore: true,
									};
									if (!res.showScore) {
										update(ref(db), updates);
									}
								} else {
									console.log('No data available');
								}
							})
							.catch((error) => {
								console.error(error);
							});
					}}
				/>
			</Link>

			<div className="flex items-end justify-between h-full w-full mt-4 xs-mobile:mt-5">
				<DeckIcons />
			</div>
		</div>
	);
};

export default RevealScores;
