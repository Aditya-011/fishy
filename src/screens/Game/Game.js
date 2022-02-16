import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFirebaseRef from '../../utils/useFirebaseRef';
import { CodeContext, UserContext } from '../../context/context';
import Discussion from '../Host/Discussion/Discussion';
import GameRounds from '../Player/GameRounds/GameRounds';

const Game = () => {
	const { roomId } = useParams();
	const user = useContext(UserContext);
	console.log(user);
	const [properties, loading] = useFirebaseRef(
		'sessions/' + roomId + '/properties'
	);
	const [authUser, setAuthUser] = useState(false);

	useEffect(() => {
		if (properties && user) {
			if (properties.host.userID === user.id) {
				setAuthUser(true);
			} else {
				setAuthUser(false);
			}
		}
	}, [properties, user]);
	console.log(authUser);

	return (
		<div>
			{!loading && user ? authUser ? <Discussion /> : <GameRounds /> : null}
		</div>
	);
};

export default Game;
