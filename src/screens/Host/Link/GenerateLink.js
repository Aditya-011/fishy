import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';

import './GenerateLink.css';

import {
	UserContext,
	CodeContext,
	AuthContext,
} from '../../../context/context';
import Settings from '../Settings/Settings';
import Rules from '../../Rules/Rules';
import Refresh from '../../../images/refresh.png';
import SettingIcon from '../../../images/settings.png';

import Heading from '../../../components/Heading';
import Button from '../../../components/Button/Button';
import FlashCard from '../../../components/Flashcard/Flashcard';
import Modal from '../../../components/Modal/Modal';
import Icons from '../../../components/Icons/Icons';
import NavComponent from '../../../components/NavComponent';

import { database as db } from '../../../firebase';
import { ref, set, get, child, push, update } from 'firebase/database';
import useFirebaseRef from '../../../components/useFirebaseRef';

const GenerateLink = () => {
	const user = useContext(UserContext);
	const { authUser } = useContext(AuthContext);
	const { code, setCode } = useContext(CodeContext);
	const [waiting, setWaiting] = useState(false);
	const [settings, showSettings] = useState(false);
	const [rules, showRules] = useState(false);
	const [timer, setTimer] = useState(120);

	function generateCode(length) {
		var result = '';
		var characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		// console.log(result);
		return result;
	}

	const newRoom = () => {
		// Make 5 attempts to create a unique game session
		const userID = user.id;
		console.log(user.id);
		setWaiting(true);
		let attempts = 0;
		while (attempts < 5) {
			const gameId = generateCode(7);
			if (checkIfExists(code)) {
				++attempts;
				setCode(gameId);
				continue;
			} else {
				set(ref(db, 'sessions/' + code), {
					properties: {
						timer,
						isStarted: false,
						isOver: false,
						host: {
							userID,
							name: 'Logan',
						},
					},
				});
				set(ref(db, 'users/' + userID), {
					name: 'logan',
				});

				console.log('host added');
				setWaiting(false);
				return;
			}
		}
		// Unsuccessful game creation
		setWaiting(false);
		alert('Error: Could not find an available game ID.');
	};

	const checkIfExists = (code) => {
		const dbRef = ref(db);
		console.log(code);
		get(child(dbRef, `sessions/${code}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					return true;
				} else {
					return false;
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};
	useEffect(() => {
		setCode(generateCode(7));
	}, []);

	/* const createRoom = () => {
		checkIfExists();
		console.log(user);
		const userID = user.uid;
		console.log(user.uid);

		set(ref(db, 'sessions/' + code), {
			properties: {
				timer,
				host: {
					userID,
					name: 'Logan',
				},
			},
		});
		set(ref(db, 'sessionData/' + code), {
			state: {
				r1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			},
		});
		set(ref(db, 'users/' + userID), {
			name: 'logan',
		});

		console.log('host added');
	}; */

	const ruleHandler = () => {
		showRules(!rules);
	};
	console.log(code);
	return (
		<div className="flex flex-col h-screen w-full">
			<div className="flex flex-col justify-center items-start w-full">
				<div className="block mt-2">
					{authUser ? (
						<Icons
							icon={SettingIcon}
							clickHandler={() => showSettings(!settings)}
							title={'Settings'}
						/>
					) : null}
				</div>
				<div className="inline-block ml-auto mr-auto mt-3">
					<FlashCard text={'Fishy Equilibrium'} />
				</div>
			</div>
			<div className="max-w-7xl self-center ml-auto mr-auto">
				<NavComponent ekey="profile">
					<Tab eventKey="profile" title="Host" tabClassName="w-100 flex-grow-1">
						{!waiting ? (
							<div className="flex flex-row justify-center items-center p-8">
								<Heading text={`Room Code: ${code}`} />
								<Icons
									icon={Refresh}
									title={'Refresh'}
									clickHandler={newRoom}
								/>
							</div>
						) : null}
					</Tab>
				</NavComponent>
			</div>
			{!waiting ? (
				<div className="m-auto mt-5">
					<Link to={`/lobby/${code}`}>
						<Button
							display={'bg-btn-bg-primary text-warning'}
							text={'Next'}
							clickHandler={() => {
								newRoom();
							}}
						/>
					</Link>
				</div>
			) : null}

			<div className="flex justify-around items-end h-full flex-row w-full">
				<div className="p-2">
					<Icons
						icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/rules-list.png`}
						title={`Rules`}
						clickHandler={ruleHandler}
					/>
				</div>
				<div></div>
			</div>

			{settings ? (
				<Modal>
					<Settings
						showSettings={() => showSettings(false)}
						gameCode={code}
						timer={timer}
						setTimer={setTimer}
					/>
				</Modal>
			) : null}

			{rules ? (
				<Modal>
					<Rules showRules={() => showRules(false)} />
				</Modal>
			) : null}
		</div>
	);
};

export default GenerateLink;
