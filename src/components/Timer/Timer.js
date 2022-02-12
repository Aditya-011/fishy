import React, { useContext, useState, useEffect } from "react";
import "./Timer.css";
import { useTimer } from "react-timer-hook";
import { AuthContext } from "../../context/context";
import Icons from "../Icons/Icons";
import Pause from "../../images/pause.png";
import Resume from "../../images/resume.png";
import { database as db } from "../../firebase";
import { get, child, ref, onValue,update } from "firebase/database";

function MyTimer({ expiryTimestamp, auth, toggle, code }) {
  const { seconds, minutes, isRunning, start, pause, resume, restart } =
  useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });
  const [stop, setStop] = useState(false);
  useEffect(() => {
    
   
    getPlayStatus();
    console.log(`timer status ${stop}`);
  
  }, []);
  useEffect(() => {
  
  }, [stop]);

  const updateStopTimer=()=>
  {
    get(child(ref(db),`sessionData/${code}/hostProperties`)).then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val()
        const updates = {};
        updates[`sessionData/${code}/hostProperties`] = {...res,stopTimer:!stop};
        update(ref(db), updates)
       
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  const getPlayStatus = () => {
    const starCountRef = ref(db, `sessionData/${code}`);
    onValue(starCountRef, (snapshot) => {
      const res = Object.values(snapshot.val());
      setStop(res[0].stopTimer)
    
    
      //console.log(res[0].stopTimer);
    });
  };


  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      {auth ? (
        <>
          {" "}
          {toggle.toggle ? (
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
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

const Timer = ({ timer, round }) => {
  const { auth } = useContext(AuthContext);
  const [time, setTime] = useState(new Date());
  const [toggle, settoggle] = useState(true);
  // 10 minutes timer
  console.log(auth);
  const code = sessionStorage.getItem("code");
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
    setTime(time.setSeconds(time.getSeconds() + timer));
    console.log(time);
  }, []);
  return (
    <div>
      <MyTimer
        expiryTimestamp={time}
        auth={auth}
        code={code}
        toggle={{ toggle, settoggle }}
      />
    </div>
  );
};

export default Timer;
