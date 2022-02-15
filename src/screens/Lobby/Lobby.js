import React, { useContext, useState, useEffect } from 'react';
import FlashCard from '../../components/Flashcard/Flashcard';
import Button from '../../components/Button/Button';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext, AuthContext, CodeContext } from '../../context/context';
import './Lobby.css';
import { database as db } from '../../firebase';
import {
	ref,
	child,
	get,
	push,
	update,
	onValue,
	updateStarCount,
	onSnapshot,
	doc,
	set,
} from 'firebase/database';
import useFirebaseRef from '../../components/useFirebaseRef';
import toast from 'react-hot-toast';

const Lobby = () => {
	const navigate = useNavigate();
	const [isStarted, setisStarted] = useState(false);
	const { authUser, setAuthUser } = useContext(AuthContext);
	const { code } = useContext(CodeContext);
	const user = useContext(UserContext);
	const [properties, loading] = useFirebaseRef(
		'sessions/' + code + '/properties'
	);
	const [players] = useFirebaseRef('sessions/' + code + '/users');
	/* var Players;
	const [players, setPlayers] = useState([]); */
	// const { id } = useParams();
	/* let code = id;
	if (!code) {
		if (location.state) code = location.state.code;
		console.log(code);
	}
	console.log(code); */
	const clickHandler = () => {
		if (properties && Object.keys(players).length === 2) {
			//console.log(snapshot.val());
			const data = properties;
			const updates = {};
			updates['sessions/' + code + '/properties'] = {
				...data,
				isStarted: true,
			};
			update(ref(db), updates);
		} else {
			console.log('No data available');
			toast.error("Waiting for players")
		}
	};

	const isAuthUser = () => {
		if (properties) {
			if (properties.host.userID === user.id) {
				setAuthUser(true); // console.log(properties);
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
			/* set(
				ref(
					db,
					'sessionData/' + code + '/state/1/' + userID
				),
				{
					eye: false,
					name,
					indivScore: 0,
					isSelected: {
						status: false,
						choice: 0,
					},
					isSubmit: {
						status: false,
						choice: 0,
					},
				}
			); */
			navigate(`/round/${1}`, {
				state: {
					code,
				},
			});
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
				<Button
					display={'bg-btn-bg-primary bg-center btn-lg'}
					text={'Start Game'}
					clickHandler={clickHandler}
				/>
			) : null}
		</div>
	);
};

export default Lobby;
