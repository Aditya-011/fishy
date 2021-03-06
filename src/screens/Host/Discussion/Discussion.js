import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import FlashCard from '../../../components/Flashcard/Flashcard';
import Timer from '../../../components/Timer/Timer';
import Fish1and2 from '../../../images/Fish1and2.png';
import ShowOptions from '../ShowOptions/ShowOptions';
import DeckIcons from '../../..//components/DeckIcons/DeckIcons';
import Pause from '../../../images/pause.png';
import Resume from '../../../images/resume.png';
import Icons from '../../../components/Icons/Icons';
import ChoiceAndSubmit from '../ChoiceAndSubmit/ChoiceAndSubmit';
import { ref, update, get, child } from 'firebase/database';
import { database as db } from '../../../firebase';
import { CodeContext } from '../../../context/context';
import './Discussion.css';
import {toast} from 'react-hot-toast'
import useFirebaseRef from '../../../utils/useFirebaseRef';

const Discussion = () => {
	const { roomId, id } = useParams();
	console.log(id);
	const navigate = useNavigate();
	const timeP = useRef(120);
	const [time, setTime] = useState(120);
	const [timePercent, setTimePercent] = useState(0);
	const [mode, setMode] = useState(false);
	// const { code } = useContext(CodeContext);
	const [playerInfo, loading] = useFirebaseRef(
		`sessionData/${roomId}/state/${id}`
	);
	console.log(playerInfo);
	const [hostProperties, loading1] = useFirebaseRef(
		`sessionData/${roomId}/hostProperties/`
	);
	console.log(hostProperties);
	// console.log(code);

	/* const getPlayers = () => {
		onValue(ref(db, `sessionData/${code}/state/${roundNo.id}`), (snapshot) => {
			console.log(`sessionData/${code}/state/${roundNo.id}`);
			//  console.log(snapshot.val());
			const data = Object.values(snapshot.val());
			console.log(data);
			setPlayerInfo(data);

		});
	}; */
  const getTimer =()=>
  {
    get(child(ref(db),`sessions/${roomId}/properties`)).then((snapshot) => {
      if (snapshot.val().timer) {
      const res = (snapshot.val().timer)
      console.log(res);
      setTime(res)
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    
  }
	const checkIfOver = () => {
		let sum = 0;

		if (playerInfo) {
			const data = Object.values(playerInfo);
			for (let i = 0; i < data.length; i++) {
				console.log(data[i]);
				if (data[i].isSubmit.status) sum++;
				console.log(sum);
			}
		}
		if (sum === 2) {
			// change here
			console.log(`Sum =  ${sum}`);
			if (hostProperties) {
				console.log(hostProperties);
				const updates = {};
				updates[`sessionData/${roomId}/hostProperties/`] = {
					...hostProperties,
					isOver: true,
				};
				update(ref(db), updates);
			} else {
				console.log('No data available');
			}
			console.log('round over');
			navigate(`/game/${roomId}/host/results/${id}`);
		}
		else
		{
			toast.error("Waiting for players")
		}
	};

	useEffect(() => {
    getTimer()
    console.log(time);
		console.log(playerInfo);
		console.log(hostProperties);
		checkIfOver();
	}, [playerInfo, hostProperties]);

	useEffect(() => {
		get(child(ref(db), 'sessionData/' + roomId + '/hostProperties'))
			.then((snapshot) => {
				if (snapshot.exists()) {
					const data = snapshot.val();
					console.log(data);
					const updates = {};
					updates['sessionData/' + roomId + '/hostProperties'] = {
						...data,
						movetoWaitingRoom: false,
						nextRound: false,
						showScore: false,
						startTime: '',
						stopTimer: false,
						isOver: false,
					};
					update(ref(db), updates);
				} else {
					console.log('No data available');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}, [id]);

	return (
		<div className="p-1 mt-1 flex flex-col justify-center items-center h-screen">
			<div className="md:w-96 xs-mobile:w-9/12">
				<FlashCard text={`Day ${id}`} />
			</div>
			<div className="flex flex-row w-full justify-center items-center">
				<div><Timer completed={timePercent} round={id} timer={time} /></div>
				<div className="pause-button ml-3.5">
					{/*!mode ? (
          //  <Icons clickHandler={pauseButton} icon={Pause} />
          ) : (
          //  <Icons clickHandler={resumeButton} icon={Resume} />
          )*/}
				</div>
			</div>
			<div className="flex mt-2 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center">
				{console.log(playerInfo)}
				{!loading &&
					playerInfo &&
					Object.values(playerInfo).map((p) => (
						<div className="yo p-2" key={Math.random()}>
							<FlashCard text={p.name} />
							<ChoiceAndSubmit
								choice={p.isSubmit.status ? p.isSubmit.choice : null}
								toggle={!p.isSubmit.status ? p.isSelected.choice : null}
								time={time}
								paused={mode}
							/>
						</div>
					))}
			</div>
			<div className="results">
				{!loading && !loading1 ? (
					<Button
						text={'Results'}
						display={'bg-btn-bg-primary p-3 bg-center btn-lg'}
						clickHandler={checkIfOver}
					/>
				) : null}
			</div>

			<div className="flex items-end justify-between h-full w-full">
				<DeckIcons />
			</div>
		</div>
	);
};

export default Discussion;
