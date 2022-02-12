import React, { useState, useEffect, useContext } from "react";
import FlashCard from "../../../components/Flashcard/Flashcard";
import "./Scoreboard.css";
import Scores from "../../../components/Scores/Scores";
import { SocketContext } from "../../../context/SocketContext";
import { set, ref, update, get, child, onValue } from "firebase/database";
import { database as db } from "../../../firebase";
import { UserContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";

const Scoreboard = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const code = sessionStorage.getItem("code");
  const round = useContext(UserContext)
  const [scoreData, setScores] = useState([]);
  const [playerData, setPlayers] = useState([]);
  const [show, setShow] = useState(false);
  const getPlayers = () => {
    get(child(ref(db), `sessions/${code}/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          console.log(data);
          setPlayers(data);
          return
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getPlayersData = () => {
    get(child(ref(db), `sessionData/${code}/state`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const data = Object.values(snapshot.val());
        console.log(data);
        setScores(data);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  /*  onValue(ref(db, `sessionData/${code}/state`), (snapshot) => {
      console.log(`sessionData/${code}/state`);
      //  console.log(snapshot.val());
     
      return
    });*/
  }
  const waitingRoom = () => {
    console.log('kuhg');
    const starCountRef = ref(db, `sessionData/${code}/hostProperties`);
    onValue(starCountRef, (snapshot) => {
      const res = snapshot.val();
      console.log("move to waitin");
      if (res.movetoWaitingRoom) {
        navigate("/waiting");
      }
    });
  };
  useEffect(() => {
    //console.log('khjvhgtfyrdctdr');
    getPlayers();
    getPlayersData();
    
  }, []);
  useEffect(()=>
  {
    waitingRoom();
  },[round])
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="md:w-96 xs-mobile:w-9/12">
        <FlashCard text={`Scores`} />
      </div>
      <div className="tables flex flex-row justify-center self-center xs-mobile:w-full md:w-5/6 ml-auto mr-auto overflow-y-auto">
        {scoreData ? (
          <Scores show={show} scores={scoreData} players={playerData} />
        ) : null}
      </div>
    </div>
  );
};

export default Scoreboard;
