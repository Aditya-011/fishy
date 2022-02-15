import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import FlashCard from '../../../components/Flashcard/Flashcard';
import { CodeContext } from '../../../context/context';
import ShowOptions from '../../Host/ShowOptions/ShowOptions';

import Fish1 from '../../../images/Fish1-new.png';
import Fish2 from '../../../images/Fish2-new.png';

import useFirebaseRef from '../../../utils/useFirebaseRef';

const SeeResults = () => {
	let { roomId, id } = useParams();
	// const { code } = useContext(CodeContext);
	const navigate = useNavigate();
	const [players, loading] = useFirebaseRef(
		`sessionData/${roomId}/state/${id}`
	);
	const [hostProperties, loading1] = useFirebaseRef(
		`sessionData/${roomId}/hostProperties`
	);

	useEffect(() => {
		console.log(players);
	}, []);
	useEffect(() => {
		if (!loading1 && hostProperties) {
			if (hostProperties.showScore && hostProperties.isOver)
				navigate(`/game/${roomId}/player/scores`);
		}
	}, [id, loading1, hostProperties]);
	return (
		<div className="flex flex-col items-center justify-center pt-1">
			<div className="md:w-96 xs-mobile:w-9/12">
				<FlashCard text={`Day ${id}`} />
			</div>
			<div className="flex mt-4 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center">
				{players &&
					!loading &&
					Object.values(players).map((player, index) => {
						return (
							<div className="inner-div flex flex-col md:p-1" key={index}>
								<div className="xs-mobile:w-4/6 mobile:w-full w-full self-center ml-auto mr-auto">
									<FlashCard text={player.name} />
								</div>
								{console.log('player choice ' + player.isSubmit.choice)}
								{player.eye ? (
									<div className="mt-3 xs-mobile:ml-auto xs-mobile:mr-auto">
										{Number(player.isSubmit.choice) === 2 ? (
											<ShowOptions fishes={Fish2} />
										) : (
											<ShowOptions fishes={Fish1} />
										)}
									</div>
								) : (
									<div className="mt-3 xs-mobile:ml-auto xs-mobile:mr-auto">
										<ShowOptions />
									</div>
								)}
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default SeeResults;
