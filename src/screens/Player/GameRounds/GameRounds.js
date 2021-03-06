import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CodeContext, UserContext } from '../../../context/context';

import Button from '../../../components/Button/Button';
import DeckIcons from '../../../components/DeckIcons/DeckIcons';
import FishOptions from '../../../components/FishOptions/FishOptions';
import FlashCard from '../../../components/Flashcard/Flashcard';
import Icons from '../../../components/Icons/Icons';
import Modal from '../../../components/Modal/Modal';
import Timer from '../../../components/Timer/Timer';

import Fish1 from '../../../images/Fish1-new.png';
import Fish2 from '../../../images/Fish2-new.png';
import three from '../../../images/three.png';
import five from '../../../images/five.png';
import ten from '../../../images/ten.png';
import './GameRounds.css';

import { set, ref, update,get,child } from 'firebase/database';
import { database as db } from '../../../firebase';
import useFirebaseRef from '../../../utils/useFirebaseRef';

const GameRounds = () => {
	// const timeP = useRef(120);
	const { roomId, id } = useParams();
	const navigate = useNavigate();
	let multiplier = useRef(0);
	const timerRef = useRef();
	const [time, setTime] = useState(120);
	const [timeFormat, setTimeFormat] = useState();
	const [timePercent, setTimePercent] = useState();
	const [choice, setChoice] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [active, setActive] = useState([false, false]);
	const [score, showScore] = useState(false);
	const [pause, setPause] = useState(false);
	const [indivScore, setIndivScore] = useState([]);

	const user = useContext(UserContext);
	// const { code } = useContext(CodeContext);
	const userID = user.id;

	const [isOver, loading] = useFirebaseRef(
		`sessionData/${roomId}/hostProperties/isOver`
	);
	const [users, loading1] = useFirebaseRef(`users/${userID}`);
	const [gameUser, loading2] = useFirebaseRef(
		'sessionData/' + roomId + '/state/' + id + '/' + userID + '/'
	);

	const checkIfOver = () => {
		if (isOver && !loading) {
			console.log('Round Over');
			setTimeout(() => {
				navigate(`/game/${roomId}/player/results/${id}`);		
			}, 700);
		}
	};
  useEffect(() => {
    getTimer()
	console.log(user);
    console.log(time);
  }, []);
	useEffect(() => {
		checkIfOver();
	}, [isOver, loading]);
	useEffect(() => {
		console.log(roomId);
		console.log(id);
		console.log(userID);

		if (id > 10) {
			navigate(`/gameover`);
		} else if (roomId && userID) {
			console.log(users);
			if (users) {
				const name = users.name;
				console.log(name);
				set(
					ref(db, 'sessionData/' + roomId + '/hostProperties/eye/' + userID),
					{
						isTrue: false,
					}
				);
				const playerRef = ref(
					db,
					'sessionData/' + roomId + '/state/' + id + '/' + userID
				);
				console.log(gameUser);
				
					if (gameUser)
						set(playerRef, {
							eye: gameUser.eye,
							name,
							indivScore: gameUser.indivScore,
							isSelected: {
								status: gameUser.isSelected.status,
								choice: gameUser.isSelected.choice,
							},
							isSubmit: {
								status: gameUser.isSubmit.status,
								choice: gameUser.isSubmit.choice,
							},
						});
					else {
						set(playerRef, {
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
						});
					}
				
			} else {
				console.log('No data available');
			}

			setChoice(gameUser ? gameUser.isSelected.choice : 0);
			setDisabled(gameUser ? gameUser.isSubmit.status : false);
			gameUser && gameUser.isSelected.choice !== 0
				? gameUser.isSelected.choice === 1
					? setActive([true, false])
					: setActive([false, true])
				: setActive([false, false]);
		}

	}, [id, users, loading1]);
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
	useEffect(() => {
		/*let active = false;
    if (!active && !pause) {
      if (time !== 0) {
        timerRef.current = setInterval(() => {
          const secondCounter = time % 60;
          const minuteCounter = Math.floor(time / 60);
          setTime(time - 1);
          sessionStorage.setItem("time-val", time - 1);
          const computedSecond =
            String(secondCounter).length === 1
              ? `0${secondCounter}`
              : secondCounter;
          const computedMinute =
            String(minuteCounter).length === 1
              ? `0${minuteCounter}`
              : minuteCounter;
          sessionStorage.setItem(
            "time-format",
            computedMinute + ":" + computedSecond
          );
          setTimeFormat(computedMinute + ":" + computedSecond);
          let originalTime = timeP.current;
          // console.log(timeP.current);
          // console.log(time);
          const percent = 100 - ((originalTime - time) / originalTime) * 100;
          // console.log(percent);
          setTimePercent(percent);
        }, 1000);
      } else {
        setTime(0);
        setTimeFormat("0:00");
        setTimePercent(0);
        socket.emit("submit", { choice, playerName, code });
        setDisabled(true);
        Number(choice) === 1
          ? setActive([true, false])
          : setActive([false, true]);
        sessionStorage.setItem("time-val", 0);
        sessionStorage.setItem("time-format", "0:00");
      }
    }

    return () => {
      clearInterval(timerRef.current);
      active = true;
    };*/
	}, [id, users, loading1, gameUser, loading2]);

	const selectChoice = (num) => {
		num === 1 ? setActive([true, false]) : setActive([false, true]);
		setChoice(num);
		console.log('choice made', num);

		if (gameUser && !loading2) {
			const updates = {};
			updates['sessionData/' + roomId + '/state/' + id + '/' + userID] = {
				...gameUser,
				isSelected: {
					choice: num,
					status: true,
				},
			};
			console.log(gameUser);
			update(ref(db), updates);
		} else {
			console.log('No data available');
		}
	};

	const submitChoice = () => {
		//cearInterval(timerID);
		if (gameUser && !loading2 && choice>0) {
			const updates = {};
			updates['sessionData/' + roomId + '/state/' + id + '/' + userID] = {
				...gameUser,
				isSubmit: {
					choice,
					status: true,
				},
			};
			console.log(gameUser);
			update(ref(db), updates);
			setDisabled(true);
		Number(choice) === 1 ? setActive([true, false]) : setActive([false, true]);
		} else {
			console.log('No data available');
		}
		
	};

	const captureClick = () => {
		if (disabled) {
			console.log(choice);
		} else {
			setActive([false, false]);
		}
	};

	if (Number(id) === 5) {
		multiplier.current = <img src={three} alt="3x" />;
	} else if (Number(id) === 8) {
		multiplier.current = <img src={five} alt="5x" />;
	} else if (Number(id) === 10) {
		multiplier.current = <img src={ten} alt="10x" />;
	}

	return (
		<div className="p-1 mt-1 flex flex-col h-screen game">
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-row md:w-96 xs-mobile:w-9/12">
					<FlashCard text={`Day ${id}`} />
					{Number(id) === 5 || Number(id) === 8 || Number(id) === 10 ? (
						<p className="rounded-full text-center px-2 py-2 ml-2 border-5 border-yellow-300">
							{multiplier.current}
						</p>
					) : null}
				</div>
        <Timer completed={timePercent} round={id} timer={time} userID={userID} code={roomId} />
			</div>
			<div
				className="flex mt-2 md:flex-nowrap justify-center items-center overflow-y-hidden"
				onClickCapture={() => captureClick()}
			>
				<div className={`p-3`}>
					<FishOptions
						fishes={Fish1}
						active={active[0]}
						SelectChoice={disabled ? null : selectChoice}
						id={1}
					/>
				</div>
				<div className={`p-3`}>
					<FishOptions
						fishes={Fish2}
						active={active[1]}
						SelectChoice={disabled ? null : selectChoice}
						id={2}
					/>
				</div>
			</div>
			{disabled ? (
				<div>
					<button
						className="text-warning bg-btn-bg-primary btn-lg bg-center w-25 self-center disabled:opacity-50 cursor-default"
						disabled
					>
						Submit
					</button>
				</div>
			) : (
				<Button
					text={'Submit'}
					clickHandler={submitChoice}
					display={'bg-btn-bg-primary bg-center btn-lg w-25 self-center'}
				/>
			)}
			<div className="absolute md:top-1/4 md:right-12 xs-mobile:top-44 xs-mobile:right-8">
				<Icons
					icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/coins.png`}
					clickHandler={() => showScore(!score)}
					title="Coins"
				/>
				<p
					style={{
						color: `var(--btn-bg-secondary)`,
						textAlign: `center`,
						fontWeight: `700`,
					}}
				>
					{indivScore &&
						indivScore.reduce((acc, value) => {
							return acc + value;
						}, 0)}
				</p>
			</div>
			<DeckIcons />
			{score ? (
				<Modal>
					<div className="inline-flex justify-end w-full relative">
						<div className="inline-flex self-start mr-auto">
							<img
								src={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/coins.png`}
								alt="coins"
							/>
							<div className="self-end ml-1 mr-auto">
								<p style={{ color: `var(--primary-text)`, fontWeight: `500` }}>
									{indivScore.reduce((acc, value) => {
										return acc + value;
									}, 0)}
								</p>
							</div>
						</div>
					</div>
					<ul className="scores">
						<li className="titles grid-display">
							{indivScore.map((value, index) => {
								return (
									<p key={index} className="grid-item">
										{`# ${index + 1}`}
									</p>
								);
							})}
						</li>
						<li className="grid-display">
							{indivScore.map((value, index) => {
								return (
									<p key={index} className="grid-display-item">
										{value}
									</p>
								);
							})}
						</li>
					</ul>
					<div className="close-btn">
						<Icons
							icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/cross.png`}
							title={'Quit'}
							clickHandler={() => showScore(!score)}
						/>
					</div>
				</Modal>
			) : null}
		</div>
	);
};

export default GameRounds;
