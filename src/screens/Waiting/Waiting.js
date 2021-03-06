import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "../../components/Button/Button";

import "./Waiting.css";
import { UserContext } from "../../context/context";
import { useNavigate ,useParams} from "react-router-dom";
import { set, ref, update, get, child, onValue } from "firebase/database";
import { database as db } from "../../firebase";
import useFirebaseRef from "../../utils/useFirebaseRef";
import { useTimer } from "react-timer-hook";
import {toast} from  'react-hot-toast'
const Waiting = () => {
  const user = useContext(UserContext);
	const navigate = useNavigate();
	const [roundNo, setRoundNo] = useState(0);
	const [timeFormat, setTimeFormat] = useState('03:00');
	const timerRef = useRef();
	const [active, setActive] = useState(false);
	const [counter, setCounter] = useState(180);
	const [waitingMsg, setWaitingMsg] = useState('');

	const [authUser, setAuthUser] = useState(false);
	// const [skipRound, setSkipRound] = useState(false);

	// const { authUser } = useContext(AuthContext);
	// const { code } = useContext(CodeContext);
	const { roomId } = useParams();



  const [disabled, setDisabled] = useState(false);
  const [sessionData, loading] = useFirebaseRef(`sessionData/${roomId}`);
	const [properties, loading1] = useFirebaseRef(
		'sessions/' + roomId + '/properties'
	);
 

  const time = new Date();
  const [player, loading2] = useFirebaseRef(`sessions/${roomId}/users`);
 
  const skipGameRound = () => {
    //const round = sessionData.state;
    Object.keys(player).forEach((pl, index) => {
      const updates = {};
      updates[`sessionData/${roomId}/state/${roundNo}/${pl}`] = {
        eye: false,
        indivScore: 0,
        isSelected: {
          choice: 0,
          status: true,
        },
        isSubmit: {
          choice: 0,
          status: true,
        },
        name: Object.values(player)[index].name,
      };
      update(ref(db), updates);
      setRoundNo(roundNo+1)
      console.log(updates);
    });
  };
  time.setSeconds(time.getSeconds() + 180); // 3 minutes timer

  const getRoundNo = () => {
		get(child(ref(db), `sessionData/${roomId}/state`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					const res = Object.keys(snapshot.val()).at(-1);
					console.log(res);
					setRoundNo(Number(res) + 1);
				} else {
					console.log('No data available');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};



  const movetoNextRound = () => {
		if (
			sessionData &&
			sessionData.hostProperties.nextRound &&
			sessionData.hostProperties.isOver
		) {
			const next = roundNo;
			const message = `Moving to day ${next}`;
			console.log(next);
			toast.success(message);
      if(!authUser)	{	setTimeout(() => {
				navigate(`/game/${roomId}/round/${next}`);
			}, 700);}
      else
      {
        navigate(`/game/${roomId}/round/${next}`);
      }
		}
	};

  useEffect(() => {
		getRoundNo();
    
	}, [roomId,sessionData]);
  
  useEffect(() => {
	
  movetoNextRound();
		console.log(roundNo);
	}, [sessionData, loading]);
  useEffect(() => {
		if (properties && user) {
      if(!authUser && properties.isOver)
      {
        navigate(`/gameover`)
      } 
			if (properties.host.userID === user.id) {
				setAuthUser(true);
			}
      
      else {
				setAuthUser(false);
			}
		}
    
	}, [properties, user, loading1]);

  const startGame = () => {
		get(child(ref(db), `sessionData/${roomId}/hostProperties`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					console.log(snapshot.val());
					const res = snapshot.val();
					const updates = {};
					updates[`sessionData/${roomId}/hostProperties`] = {
						...res,
						nextRound: true,
					};
					update(ref(db), updates);
					// navigate(`/game/${roomId}/round/${roundNo}`);
				} else {
					console.log('No data available');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const endGame = () => {
    const updates = {};
    updates[`sessions/${roomId}/properties`] = {...properties,isOver:true};
    update(ref(db), updates);
      navigate("/gameover");
  
	};



  function MyTimer({ expiryTimestamp }) {
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({
      expiryTimestamp,
      onExpire: () => console.warn("onExpire called"),
    });
    useEffect(() => {
      if (!active && !disabled) {
        pause();
        console.log(`paused ${disabled}`);
      }
    }, []);

    return (
      <button
        style={{ textAlign: "center" }}
        onClick={() => {
          if (active) {
            setActive(false);
            console.log(`timer is pause`);
            //pause()
          } else {
            setActive(true);
            setDisabled(true);
            console.log(`timer is play`);
            //  resume()
          }
        }}
        className="text-warning self-center text-8xl bg-black rounded-full px-3 py-3"
        disabled={disabled}
      >
        <div style={{ fontSize: "100px" }}>
          <span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-auto">
        <h1 className="text-yellow-800 bg-yellow-400 px-3 pt-3 pb-2 rounded-lg text-md mb-0">
          {"Waiting Arena"}{" "}
        </h1>
      </div>
      <div className="bg-card bg-no-repeat bg-cover">
        {(roundNo === 5 || roundNo === 8 || roundNo === 10) && authUser ? (
          <div className="flex flex-col w-full justify-center items-center pt-3">
            <h1 className="text-2xl text-warning font-bold px-4">
              {!active
                ? "Start the discussion for team leaders!"
                : "Discussion started!"}
            </h1>

            <MyTimer expiryTimestamp={time} active={active} />
          </div>
        ) : null}
        {authUser ? (
          roundNo < 11 ? (
            <div className="flex flex-row justify-center items-center py-10 px-10 w-full">
              <div>
                <button
                  onClick={startGame}
                  className="skip-btn btn-lg"
                >{`Go to Day ${roundNo}`}</button>
              </div>
              <div>
                <button
                  onClick={skipGameRound}
                  className="skip-btn btn-lg ml-5"
                >{`Skip Day ${roundNo}`}</button>
              </div>
            </div>
          ) : (
            <Button
              text={`End Game`}
              display={"bg-btn-bg-primary p-4"}
              clickHandler={endGame}
            />
          )
        ) : (
          <div className="flex flex-col">
            <h1 className="text-warning text-2xl font-bold px-10 pt-10">
              Waiting for the host to start the next round
            </h1>
            <p className="self-center text-white my-2 text-xl">{waitingMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Waiting;
