import React, { useContext, useEffect, useState } from 'react';
import FlashCard from '../../components/Flashcard/Flashcard';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext, CodeContext } from '../../context/context';
import './Lobby.css';
import { database as db } from '../../firebase';
import { ref, update } from 'firebase/database';
import useFirebaseRef from '../../utils/useFirebaseRef';

const Lobby = () => {
	const navigate = useNavigate();
	const [authUser, setAuthUser] = useState(false);
	const { id } = useParams();
	const code = id;
	const user = useContext(UserContext);
	const [properties, loading] = useFirebaseRef(
		'sessions/' + code + '/properties'
	);
	const [players] = useFirebaseRef('sessions/' + code + '/users');

	const clickHandler = () => {
		if (properties) {
			const data = properties;
			const updates = {};
			updates['sessions/' + code + '/properties'] = {
				...data,
				isStarted: true,
			};
			update(ref(db), updates);
		} else {
			console.log('No data available');
		}
	};

	const isAuthUser = () => {
		if (properties) {
			if (properties.host.userID === user.id) {
				setAuthUser(true);
			}
		}
	};

	const watchIfStarted = () => {
		if (properties && properties.isStarted === true) {
			console.log('yes');
			console.log(players);
			Object.entries(players).forEach((element) => {
				console.log(element);
			});
			navigate(`/game/${code}/round/${1}`, { replace: true });
		}
	};

	useEffect(() => {
		console.log(user.id);
		console.log(authUser);
		console.log(code);
		watchIfStarted();
		isAuthUser();
	}, [properties]);

	return (
		<div className="flex flex-col items-center justify-center h-full pt-2">
			<div className="">
				<FlashCard text={'Players'} />
			</div>
			<div className="room-code">
				<FlashCard text={`Room Code : ${code}`} />
			</div>
			<ul className="list-none inline-flex self-center justify-center items-center xs-mobile:flex-wrap md:flex-nowrap">
				{players
					? Object.values(players).map((player, index) => (
							<li key={index} className={'inline-block mt-4 p-3'}>
								<FlashCard text={player.name} />
							</li>
					  ))
					: console.log(1)}
			</ul>
			{authUser && !loading ? (
				players && Object.keys(players).length === 2 ? (
					<Button
						display={'bg-btn-bg-primary bg-center btn-lg'}
						text={'Start Game'}
						clickHandler={clickHandler}
					/>
				) : null
			) : null}
		</div>
	);
};

export default Lobby;
