import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "../../components/Button/Button";

import "./Waiting.css";
import { AuthContext, CodeContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { set, ref, update, get, child, onValue } from "firebase/database";
import { database as db } from "../../firebase";
import useFirebaseRef from "../../components/useFirebaseRef";
import { useTimer } from "react-timer-hook";

const Waiting = () => {
  const navigate = useNavigate();
  const [roundNo, setRoundNo] = useState(0);
  const [timeFormat, setTimeFormat] = useState("03:00");
  const timerRef = useRef();
  const [active, setActive] = useState(false);
  const [counter, setCounter] = useState(180);
  const [waitingMsg, setWaitingMsg] = useState("");
  const { authUser } = useContext(AuthContext);
  const { code } = useContext(CodeContext);

  const [sessionData, loading] = useFirebaseRef(`sessionData/${code}`);
  const time = new Date();
  const [player, loading1] = useFirebaseRef(`sessions/${code}/users`);
  useEffect(() => {
    //

    if (!loading) {
      console.log(Object.keys(sessionData.state).length);
      if (Object.keys(sessionData.state).length > 0)
        setRoundNo(Object.keys(sessionData.state).length);
    }
  }, []);
  const skipGameRound = () => {
   
    //const round = sessionData.state;
	var data = {}
	Object.keys(player).forEach((pl,index)=>{
		const updates = {};
		updates[`sessionData/${code}/state/${roundNo}/${pl}`] = 
		{
			
				eye : false,
				indivScore : 0,
				isSelected:{
					choice:0,
					status:true
				},
				isSubmit:{
					choice:0,
					status:true
				},name:Object.values(player)[index].name
			
	
	}
	update(ref(db), updates);
	console.log(updates);
})

   
  };
  time.setSeconds(time.getSeconds() + 180); // 3 minutes timer
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
      if (!active) {
        //pause()
      }
    }, []);

    return (
      <button
        style={{ textAlign: "center" }}
        onClick={() => {
          if (active) {
            setActive(false);
            console.log(`timer ${active}`);
            //pause()
          } else {
            setActive(true);
            // resume()
          }
        }}
        className="text-warning self-center text-8xl bg-black rounded-full px-3 py-3"
      >
        <div style={{ fontSize: "100px" }}>
          <span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </button>
    );
  }

  const getRoundNo = () => {
    get(child(ref(db), `sessionData/${code}/state`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const res = Object.keys(snapshot.val());
          console.log(res[res.length - 1]);
          setRoundNo(Number(res[res.length - 1]) + 1);
        } else {
          console.log("No data available");
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
      const next = Object.keys(sessionData.state).length + 1;
      console.log(next);
      setTimeout(() => {
        navigate(`/round/${next}`);
      }, 1000);
    }
  };
  useEffect(() => {
    //console.log(auth);\
    getRoundNo();
    if (!authUser && !loading) {
      movetoNextRound();
    }
    console.log(roundNo);
  }, [sessionData, loading]);

  const startGame = () => {
    get(child(ref(db), `sessionData/${code}/hostProperties`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          const res = snapshot.val();
          const updates = {};
          updates[`sessionData/${code}/hostProperties`] = {
            ...res,
            nextRound: true,
          };
          update(ref(db), updates);
          // updates[`sessionData/${code}/state`]
          navigate(`/round/${roundNo}`);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const endGame = () => {
    navigate("/gameover");
  };

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

            <MyTimer expiryTimestamp={time} />
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
