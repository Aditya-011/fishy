import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useFirebaseRef from '../../components/useFirebaseRef';
import { AuthContext } from '../../context/context';
import Discussion from '../Host/Discussion/Discussion';
import GameRounds from '../Player/GameRounds/GameRounds';

const Game = () => {
	const { authUser } = useContext(AuthContext);
	// const [properties] = useFirebaseRef('sessions/' + code + '/properties')

	return <div>{authUser ? <Discussion /> : <GameRounds />}</div>;
};

export default Game;
