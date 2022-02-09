import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import FlashCard from "../../../components/Flashcard/Flashcard";
import Timer from "../../../components/Timer/Timer";
import { SocketContext } from "../../../context/SocketContext";
import Fish1and2 from "../../../images/Fish1and2.png";
import ShowOptions from "../ShowOptions/ShowOptions";
import DeckIcons from "../../..//components/DeckIcons/DeckIcons";
import Pause from "../../../images/pause.png";
import Resume from "../../../images/resume.png";
import Icons from "../../../components/Icons/Icons";
import ChoiceAndSubmit from "../ChoiceAndSubmit/ChoiceAndSubmit";
import { set, ref, update, get, child, onValue } from "firebase/database";
import { database as db } from "../../../firebase";
import { UserContext } from "../../../context/context";
import "./Discussion.css";

const Discussion = () => {
  const roundNo = useParams();
  const navigate = useNavigate()
  const code = sessionStorage.getItem("code");
  const timeP = useRef(120);
  var Players;
  const [time, setTime] = useState(120);
  const [timeFormat, setTimeFormat] = useState("0:00");
  const [timePercent, setTimePercent] = useState(0);
  const [count, setCount] = useState(0);
  const [playerInfo, setPlayerInfo] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [mode, setMode] = useState(false);
  let timerRef = useRef();

 
  const getPlayers = () => {
    onValue(
      ref(db, `sessionData/${code}/state/${roundNo.id}`),
      (snapshot) => {
        console.log(`sessionData/${code}/state/${roundNo.id}`);
      //  console.log(snapshot.val());
        const data = Object.values(snapshot.val());
        console.log(data);
        setPlayerInfo(data)
       
        setCount(count+1)
      }
    )
  };

  const checkIfOver = ()=>
  {
    var sum=0;
    onValue(ref(db,`sessionData/${code}/state/${roundNo.id}`), (snapshot) => {
      const data =  Object.values(snapshot.val());
      for (let i = 0; i < data.length; i++) {
       console.log(data[i]);
        if(data[i].isSubmit.status)
        sum++
       console.log(sum);
      }
    //  console.log(data);
    });
    if(sum=== 2)                          // change here
    {
      get(child(ref(db), `sessionData/${code}/hostProperties/`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          const prop = snapshot.val()
          /*set(ref(db, `sessionData/${code}/hostProperties/`), {
           lk:'dsfedd'*
          });*/
         const updates = {};
          updates[`sessionData/${code}/hostProperties/`] = {...prop,isOver : true};
          update(ref(db), updates);
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
      console.log('round over');
      navigate(`/host/results/${roundNo.id}`)
   
    }
  }

  useEffect(() => {
    getPlayers();
    console.log(playerInfo);
  }, []);

  useEffect(() => { 
    get(child(ref(db), "sessionData/" + code))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const updates = {};
      updates["sessionData/" + code] = {
        ...data,
        hostProperties: {
          movetoWaitingRoom : false,
          nextRound:false,
          showScore:false,
          startTime: "",
          stopTimer: false,
          isOver: false
        },
      };
      update(ref(db), updates);
      
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
  }, [roundNo.id]);

  
  return (
    <div className="p-1 mt-1 flex flex-col justify-center items-center h-screen">
      <div className="md:w-96 xs-mobile:w-9/12">
        <FlashCard text={`Day ${roundNo.id}`} />
      </div>
      <div className="flex flex-row w-full justify-center items-center">
        <div>
          <Timer time={timeFormat} completed={timePercent} />
        </div>
        <div className="pause-button ml-3.5">
          {/*!mode ? (
          //  <Icons clickHandler={pauseButton} icon={Pause} />
          ) : (
          //  <Icons clickHandler={resumeButton} icon={Resume} />
          )*/}
        </div>
      </div>
      <div className="flex mt-2 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center">
      {playerInfo &&
          playerInfo.map(p => (
            <div className="yo p-2" key={Math.random()}>
              <FlashCard text={p.name} />
              <ChoiceAndSubmit
                choice={p.isSubmit.status ?p.isSubmit.choice : null}
                toggle={!p.isSubmit.status ?p.isSelected.choice : null}
                //submitHostChoice={num => selectChoice(num, p.name)}
                time={time}
                paused={mode}
              />
            </div>
          ))}

      </div>
      <div className="results">
        { <Button
              text={"Results"}
              display={"bg-btn-bg-primary p-3 bg-center btn-lg"}
              clickHandler={checkIfOver}
            />}
      </div>

      <div className="flex items-end justify-between h-full w-full">
        <DeckIcons />
      </div>
    </div>
  );
};

export default Discussion;
