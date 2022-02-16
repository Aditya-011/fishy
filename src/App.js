import {
	auth,
	signInAnonymously,
	onAuthStateChanged,
	database as db,
} from './firebase';
import { ref, onValue, update } from 'firebase/database';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './screens/Home/Home';
import Carousel from './screens/Rules/Rules';
import GenerateLink from './screens/Host/Link/GenerateLink';
import Lobby from './screens/Lobby/Lobby';
import Intro from './screens/Intro/Intro';
import Game from './screens/Game/Game';
import RevealScores from './screens/Host/RevealScores/RevealScores';
import SeeResults from './screens/Player/SeeResults/SeeResults';
import Scoreboard from './screens/Host/Scoreboard/Scoreboard';
import PlayerScoreboard from './screens/Player/Scoreboard/Scoreboard';
import Endgame from './screens/Endgame/Endgame';
import Waiting from './screens/Waiting/Waiting';

import { UserContext, AuthContext, CodeContext } from './context/context';
import { Toaster } from 'react-hot-toast';

function App() {
	// const [authUser, setAuthUser] = useState(false);
	const [isUser, setIsUser] = useState(null);
	const [user, setUser] = useState(null);
	// const [code, setCode] = useState('');
	console.log(user);

	useEffect(() => {
		return onAuthStateChanged(auth, (userObj) => {
			if (userObj) {
				// User is signed in.
				const user = userObj.toJSON();
				console.log(user);
				setIsUser(user);
				console.log(isUser);
			} else {
				// User is signed out.
				console.log('hehe');
				setIsUser(null);
				signInAnonymously(auth).catch((err) => {
					alert('Unable to connect to the server. Please try again later.');
				});
			}
		});
	}, []);

	useEffect(() => {
		if (!isUser) {
			setUser(null);
			return;
		}
		const userRef = ref(db, `/users/${isUser.uid}`);
		let unsubscribe = onValue(userRef, (snapshot) => {
			if (snapshot.child('name').exists()) {
				console.log('jnsjnsdjn');
				console.log(snapshot.val());
				console.log({
					...snapshot.val(),
					id: isUser.uid,
					isUser,
				});
				console.log(isUser);
				setUser({
					...snapshot.val(),
					id: isUser.uid,
					isUser,
				});
				console.log(user);
			} else {
				update(userRef, {
					name: 'tempUser',
				});
			}
		});
		return () => {
			unsubscribe();
		};
	}, [isUser]);
	console.log(user);
	return (
		<BrowserRouter>
			<UserContext.Provider value={user}>
				{/* <AuthContext.Provider value={{ authUser, setAuthUser }}> */}
				{/* <CodeContext.Provider value={{ code, setCode }}> */}
				<Toaster position="top-right" reverseOrder={false} />
				<Routes>
					<Route path="/" exact element={<Home />} />
					<Route path="/home" exact element={<Intro />} />
					<Route path="/admin/link" exact element={<GenerateLink />} />
					<Route path="/Rules" exact element={<Carousel />} />
					<Route path="/lobby/:id" element={<Lobby />} />
					<Route path="/game/:roomId/round/:id" element={<Game />} />
					<Route
						path="/game/:roomId/host/results/:id"
						element={<RevealScores />}
					/>
					<Route
						path="/game/:roomId/player/results/:id"
						element={<SeeResults />}
					/>
					<Route path="/game/:roomId/host/scores/" element={<Scoreboard />} />
					<Route
						path="/game/:roomId/player/scores/"
						element={<PlayerScoreboard />}
					/>
					<Route path="/game/:roomId/waiting" element={<Waiting />} />
					<Route path="/gameover" element={<Endgame />} />
				</Routes>
				{/* </CodeContext.Provider> */}
				{/* </AuthContext.Provider> */}
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
