import React, { useContext, useState, useEffect } from "react";
import "./Timer.css";
import { useTimer } from "react-timer-hook";
import { AuthContext, CodeContext, UserContext } from "../../context/context";
import Icons from "../Icons/Icons";
import Pause from "../../images/pause.png";
import Resume from "../../images/resume.png";
import { database as db } from "../../firebase";
import { get, child, ref, onValue, update } from "firebase/database";
import useFirebaseRef from "../useFirebaseRef";
import { useNavigate } from "react-router-dom";

function MyTimer({ expiryTimestamp, toggle, code, round }) {
  const navigate = useNavigate();
  const { authUser } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const userID = user.uid
  const path = authUser
    ? `sessionData/${code}/hostProperties`
    : `sessionData/${code}/state/${round}/${userID}`;
  //  console.log(path);
  const [roundData, loading] = useFirebaseRef(path);
  const expiryHandler = () => {
    if (authUser && !loading) {
      const updates = {};
      updates[path] = { ...roundData, isOver: true };
      update(ref(db), updates);
      navigate(`/host/results/${round}`);
    } else {
      if (!loading) {
        const updates = {};
        updates[path] = {
          ...roundData,
          isSubmit: {
            choice: 1,
            status: true,
          },
        };
        update(ref(db), updates);
        navigate(`/player/results/${round}`);
      }
    }
  };
  const { seconds, minutes, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp,
      onExpire: () => {
        console.log("onExpire called");
        expiryHandler();
      },
    });
  const [stop, setStop] = useState(false);
  useEffect(() => {
    console.log(user);
    getPlayStatus();
    console.log(`timer status ${stop}`);
  }, []);

  const getPlayStatus = () => {
    const starCountRef = ref(db, `sessionData/${code}`);
    onValue(starCountRef, (snapshot) => {
      const res = Object.values(snapshot.val());
      setStop(res[0].stopTimer);
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      {authUser ? (
        <>
          {" "}
          {/*toggle.toggle ? (
            <Icons
              clickHandler={() => {
                updateStopTimer()
              
                toggle.settoggle(false);
              }}
              icon={Pause}
            />
          ) : (
            <Icons
              clickHandler={() => {
                updateStopTimer()
                toggle.settoggle(true);
              }}
              icon={Resume}
            />
            )*/}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

const Timer = ({ timer, round }) => {
  const [time, setTime] = useState(new Date());
  const [toggle, settoggle] = useState(true);
  // 10 minutes timer
  // console.log(auth);
  const { code } = useContext(CodeContext);
  const getTime = () => {
    get(child(ref(db), `sessionData/${code}/hostProperties`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const res = Object.values(snapshot.val());
          console.log(res);
          const date = new Date(res[5]);
          setTime(date);
          //console.log(date);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getTime();
    console.log(timer);
    setTime(time.setSeconds(time.getSeconds() + timer));
    console.log(time);
  }, []);
  return (
    <div>
      <MyTimer
        expiryTimestamp={time}
        code={code}
        toggle={{ toggle, settoggle }}
        round={round}
      />
    </div>
  );
};

export default Timer;
