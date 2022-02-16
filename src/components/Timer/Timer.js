import React, { useContext, useState, useEffect } from "react";
import "./Timer.css";
import { useTimer } from "react-timer-hook";
import { AuthContext, CodeContext, UserContext } from "../../context/context";
import Icons from "../Icons/Icons";
import Pause from "../../images/pause.png";
import Resume from "../../images/resume.png";
import { database as db } from "../../firebase";
import { get, child, ref, onValue, update } from "firebase/database";
import useFirebaseRef from "../../utils/useFirebaseRef";
import { useNavigate } from "react-router-dom";

function MyTimer({ expiryTimestamp, authUser, code, round,userID }) {
  const navigate = useNavigate();
  
  useEffect(()=>
  {
    console.log(userID);
  },[])


  const path = authUser
    ? `sessionData/${code}/hostProperties`
    : `sessionData/${code}/state/${round}/${userID}`;
  //  console.log(path);
  const [roundData, loading] = useFirebaseRef(path);
  const [stopStatus, loading2] = useFirebaseRef(
    `sessionData/${code}/hostProperties`
  );
  const expiryHandler = () => {
    if (authUser) {
      const updates = {};
      updates[path] = { ...roundData, isOver: true };
      setTimeout(() => {
        update(ref(db), updates);
      }, 400);
      //update(ref(db), updates);
      navigate(`/host/results/${round}`);
    } else {
      console.log(path);

      console.log(roundData.isSubmit.status);
      if (!roundData.isSubmit.status) {
        const updates = {};
        updates[path] = {
          ...roundData,
          isSubmit: {
            choice: 1,
            status: true,
          },
        };
        update(ref(db), updates);
      }

      // navigate(`/player/results/${round}`);
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

  const setStopStatus = (bool) => {
    if (!loading) {
      const updates = {};
      updates[`sessionData/${code}/hostProperties`] = {
        ...stopStatus,
        stopTimer: bool,
      };
      update(ref(db), updates);
    }
  };
 

 
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
     
        <>
          {" "}
          {/*toggle.toggle ? (
            <Icons
              clickHandler={() => {
              // pause();
                setStopStatus(true);
                toggle.settoggle(false);
              }}
              status='pause'
              style={authUser? {display : 'block'}:{display: 'none'}}
              icon={Pause}
            />
          ) : (
            <Icons
              clickHandler={() => {
                setStopStatus(false);
                toggle.settoggle(true);
               // resume();
              }}
              status='play'
              style={authUser? {display : 'block'}:{display: 'none'}}
              icon={Resume}
            />
            )*/}
        </>
      
    </div>
  );
}

const Timer = ({ timer, round,code,userID}) => {
  const [time, setTime] = useState(new Date());
  const [toggle, settoggle] = useState(true);
  const { user } = useContext(UserContext);
 // const userID = user.id;
  // 10 minutes timer
  // console.log(auth);
  const [properties, loading1] = useFirebaseRef(
		'sessions/' + code + '/properties'
	);
  const [authUser, setAuthUser] = useState(false);
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
		if (properties && user) {
			if (properties.host.userID === user.id) {
				setAuthUser(true);
			} else {
				setAuthUser(false);
			}
		}
	}, [properties, user, loading1]);
  useEffect(() => {
    getTime();
    console.log(timer);
    setTime(
      time.setSeconds(
        authUser ? time.getSeconds() + timer : time.getSeconds() + timer - 2
      )
    );
    console.log(time);
  }, []);
  return (
    <div>
      <MyTimer
        expiryTimestamp={time}
        code={code}
        toggle={{ toggle, settoggle }}
        round={round}
        authUser={authUser}
        userID={userID}
      />
    </div>
  );
};

export default Timer;
