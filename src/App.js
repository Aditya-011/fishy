import { auth, signInAnonymously, onAuthStateChanged } from './firebase';
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

// import { SocketContext, socket } from './context/SocketContext';
import { UserContext, AuthContext, CodeContext } from './context/context';
// import Routes from './Routes';
import { Toaster } from 'react-hot-toast';

function App() {
	const [authUser, setAuthUser] = useState(false);
	const [user, setUser] = useState(null);
	const [code, setCode] = useState('');

	useEffect(() => {
		return onAuthStateChanged(auth, (userObj) => {
			if (userObj) {
				// User is signed in.
				const tempUser = userObj.toJSON();
				console.log(tempUser);
				setUser({
					id: tempUser.uid,
					user: tempUser,
				});
				console.log(user);
			} else {
				// User is signed out.
				console.log('hehe');
				// setAuthUser(null);
				signInAnonymously(auth).catch((err) => {
					alert('Unable to connect to the server. Please try again later.');
				});
			}
		});
	}, []);
	/* const [user] = useAuthState(auth);
	useEffect(() => {
		console.log(user);
		if (!user) {
			signInAnonymously(auth).catch((err) => {
				alert('Unable to connect to the server. Please try again later.');
			});
		}
	}, [user]); */
	/* useEffect(() => {
		if (!authUser) {
			console.log('hehe1');
			setUser(null);
			return;
		}
		// console.log(authUser.uid);
		const userRef = ref(database, `/users/${authUser.uid}`);
		// console.log(userRef);
		const update = (snapshot) => {
			// console.log(snapshot);
      if(snapshot.exists()){
        setUser({
          id: authUser.uid,
          authUser,
          setAuthUser,
        });
      }
			// console.log(user);
		};
		onValue(userRef, update);
		return () => {
			off(userRef, update);
		};
	}, [authUser]); */
	return (
		<BrowserRouter>
			<UserContext.Provider value={user}>
				<AuthContext.Provider value={{ authUser, setAuthUser }}>
					<CodeContext.Provider value={{ code, setCode }}>
						<Toaster position="top-right" reverseOrder={false} />
						{/* <Routes code={code} setcode={setcode}></Routes> */}
						<Routes>
							<Route path="/" exact element={<Home />} />
							<Route path="/game" exact element={<Intro />} />
							<Route path="/admin/link" exact element={<GenerateLink />} />
							<Route path="/Rules" exact element={<Carousel />} />
							<Route path="/lobby/:id" element={<Lobby />} />
							<Route path="/waiting" element={<Waiting />} />
							<Route path="/round/:id" element={<Game />} />
							<Route path="/host/results/:id" element={<RevealScores />} />
							<Route path="/player/results/:id" element={<SeeResults />} />
							<Route path="/host/scores/" element={<Scoreboard />} />
							<Route path="/player/scores/" element={<PlayerScoreboard />} />
							<Route path="/gameover" element={<Endgame />} />
						</Routes>
					</CodeContext.Provider>
				</AuthContext.Provider>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
