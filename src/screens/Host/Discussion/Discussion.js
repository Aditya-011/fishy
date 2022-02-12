import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import FlashCard from '../../../components/Flashcard/Flashcard';
import Timer from '../../../components/Timer/Timer';
import { SocketContext } from '../../../context/SocketContext';
import Fish1and2 from '../../../images/Fish1and2.png';
import ShowOptions from '../ShowOptions/ShowOptions';
import DeckIcons from '../../..//components/DeckIcons/DeckIcons';
import Pause from '../../../images/pause.png';
import Resume from '../../../images/resume.png';
import Icons from '../../../components/Icons/Icons';
import ChoiceAndSubmit from '../ChoiceAndSubmit/ChoiceAndSubmit';
import { set, ref, update, get, child, onValue } from 'firebase/database';
import { database as db } from '../../../firebase';
import { CodeContext, UserContext } from '../../../context/context';
import './Discussion.css';
import useFirebaseRef from '../../../components/useFirebaseRef';

const Discussion = () => {
	const roundNo = useParams();
	console.log(roundNo);
	const navigate = useNavigate();
	const timeP = useRef(120);
	var Players;
	const [time, setTime] = useState(120);
	const [timePercent, setTimePercent] = useState(0);
	const [mode, setMode] = useState(false);
	const { code } = useContext(CodeContext);
	const [playerInfo, loading] = useFirebaseRef(
		`sessionData/${code}/state/${roundNo.id}`
	);
	console.log(playerInfo);
	const [hostProperties, loading1] = useFirebaseRef(
		`sessionData/${code}/hostProperties/`
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

	const checkIfOver = () => {
		let sum = 0;

		const data = Object.values(playerInfo);
		for (let i = 0; i < data.length; i++) {
			console.log(data[i]);
			if (data[i].isSubmit.status) sum++;
			console.log(sum);
		}
		if (sum === 2) {
			// change here
			if (hostProperties) {
				console.log(hostProperties);
				/*set(ref(db, `sessionData/${code}/hostProperties/`), {
           lk:'dsfedd'*
          });*/
				const updates = {};
				updates[`sessionData/${code}/hostProperties/`] = {
					...hostProperties,
					isOver: true,
				};
				update(ref(db), updates);
			} else {
				console.log('No data available');
			}
			console.log('round over');
			navigate(`/host/results/${roundNo.id}`);
		}
	};

	useEffect(() => {
		console.log(playerInfo);
		console.log(hostProperties);

		/* socket.emit("join-host", code);
    socket.on("toggled", playerData => {
      setPlayerInfo(playerData);
    });
    socket.on("chosen", playerData => {
      setPlayerInfo(playerData);
    });

    // socket.on("updateChoice", updatedChoice => {
    //   console.log("updated choice", updatedChoice);
    //   alert(updatedChoice);
    // });

    socket.on("stop-timer", () => {
      setTimeFormat("0:00");
      setTimePercent(0);
      setTime(0);
      setDisabled(false);
    });

    socket.on("new-timer", newTimer => {
      if (!sessionStorage.getItem("time-val")) {
        setTime(newTimer);
      }
      timeP.current = newTimer;
    });
    
    if (sessionStorage.getItem("time-format")) {
      if (sessionStorage.getItem("time-val")) {
        setTime(Number(sessionStorage.getItem("time-val")));
        setTimeFormat(sessionStorage.getItem("time-format"));
      }
    }

    socket.on("pause-status", bool => setMode(bool));
    socket.on("player-values", players => setPlayerInfo(players));*/

		// Update insted of write

		/*const dbRef = ref(db);
     get(child(dbRef, `sessions/${code}/users`)).then((snapshot) => {
       console.log( `sessions/${code}/users`);
       const data = snapshot.val()
       if (snapshot.exists()) {
        // console.log(snapshot.val());
         setPlayerInfo(data)
       // console.log(playerInfo);
        } else {
         console.log("No data available");
       }
     }).catch((error) => {
       console.error(error);
     });*/
	}, []);

	useEffect(() => {
		get(child(ref(db), 'sessionData/' + code + '/hostProperties'))
			.then((snapshot) => {
				if (snapshot.exists()) {
					const data = snapshot.val();
					console.log(data);
					const updates = {};
					updates['sessionData/' + code + '/hostProperties'] = {
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

		// checkIfOver()
		/*  if (sessionStorage.getItem("time-format")) {
      if (sessionStorage.getItem("time-val")) {
        setTime(Number(sessionStorage.getItem("time-val")));
        setTimeFormat(sessionStorage.getItem("time-format"));
      }
    }
    let active = false;
    if (!active && !mode) {
      console.log(time);
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
        sessionStorage.setItem("time-val", 0);
        sessionStorage.setItem("time-format", "0:00");
      }
    }

     playerInfo
    return () => {
      clearInterval(timerRef.current);
      active = true;
    };*/
	}, [roundNo.id]);

	return (
		<div className="p-1 mt-1 flex flex-col justify-center items-center h-screen">
			<div className="md:w-96 xs-mobile:w-9/12">
				<FlashCard text={`Day ${roundNo.id}`} />
			</div>
			<div className="flex flex-row w-full justify-center items-center">
				<div>{/* <Timer time={timeFormat} completed={timePercent} /> */}</div>
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
								//submitHostChoice={num => selectChoice(num, p.name)}
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
