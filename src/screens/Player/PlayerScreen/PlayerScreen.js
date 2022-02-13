import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { CodeContext, UserContext } from '../../../context/context';

import Button from '../../../components/Button/Button';

import './PlayerScreen.css';

import { database as db } from '../../../firebase';
import { ref, child, get, push, update, set } from 'firebase/database';

import { toast } from 'react-hot-toast';
import useFirebaseRef from '../../../components/useFirebaseRef';

const PlayerScreen = () => {
	const Navigate = useNavigate();
	const user = useContext(UserContext);
	const { code, setCode } = useContext(CodeContext);
	const [playerName, setPlayerName] = useState('');
	const [session, loading] = useFirebaseRef(`sessions/${code}`);

	useEffect(() => {
		console.log(user);
	}, []);

	const enterGame = async () => {
		// check for room in rdb
		if (code.length && playerName.length) {
			if (session) {
				const newUser = {
					name: playerName,
					role: 'player',
					rounds: [],
				};
				/* set(child(ref(db), `sessions/${code}/users`));
				set(child(ref(db), `users`)); */

				console.log(user);
				const updates = {};
				updates[`sessions/${code}/users/` + user.id] = newUser;
				updates[`users/` + user.id] = {
					name: playerName,
				};
				update(ref(db), updates);
				set(ref(db, 'sessionData/' + code + '/hostProperties/eye/' + user.id), {
					isTrue: false,
				});
				set(ref(db, 'sessionData/' + code + '/state/1/' + user.id), {
					eye: false,
					name: playerName,
					indivScore: 0,
					isSelected: {
						status: false,
						choice: 0,
					},
					isSubmit: {
						status: false,
						choice: 0,
					},
				});

				//window.location.href = `/lobby/${code}`;
				Navigate(`/lobby/${code}`);
			} else {
				console.log('No data available');
				toast.error('Lobby doesnot exist');
			}
			console.log('enter game');
		}
	};

	return (
		<div className="flex flex-col bg-card bg-no-repeat bg-cover bg-blend-screen rounded-none px-8 pt-6 pb-8 h-full">
			<div className="mb-4">
				<label
					htmlFor="Code"
					className="block text-yellow-500 text-base font-bold mb-2 py-3 "
				>
					Room Code :
				</label>
				<input
					type="text"
					placeholder="Eg:12345"
					value={code}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					onChange={(e) => setCode(e.target.value)}
					required
				></input>
			</div>

			<div className="mb-6">
				<label
					className="block text-yellow-500 text-base font-bold mb-2 py-3"
					htmlFor="Code"
				>
					Team Name :
				</label>
				<input
					type="text"
					placeholder="Eg:David"
					value={playerName}
					onChange={(e) => setPlayerName(e.target.value)}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				></input>
			</div>
			<div className="self-center join-btn">
				{!loading ? (
					<Button
						display={`bg-btn-primary`}
						text="Join"
						clickHandler={enterGame}
					/>
				) : null}
			</div>
		</div>
	);
};

export default PlayerScreen;
