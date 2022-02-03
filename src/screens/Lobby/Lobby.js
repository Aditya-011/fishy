import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import FlashCard from "../../components/Flashcard/Flashcard";
import Button from "../../components/Button/Button";
import { Link, useParams } from "react-router-dom";
import { UserContext,AuthContext } from "../../context/context";
import "./Lobby.css";
import { database as db } from "../../firebase";
import {
  ref,
  child,
  get,
  push,
  update,
  onValue,
  updateStarCount,
  onSnapshot,
  doc,
} from "firebase/database";

const Lobby = () => {
  const socket = useContext(SocketContext);
  const {auth,setAuth}= useContext(AuthContext)
  let { id } = useParams();
  var Players;
  var Properties;
  const lobby = JSON.parse(sessionStorage.getItem("lobby"));
  const [players, setPlayers] = useState([]);
  const {userID} = useContext(UserContext);
  let status = Number(sessionStorage.getItem("status"));
  const clickHandler = () => {
    socket.emit("start-game", sessionStorage.getItem("game-code"));
  };
  const getRoomProperties = () => {
    const starCountRef = ref(db, `sessions/${id}/properties`);
    onValue(starCountRef, (snapshot) => {
      console.log(snapshot.val());
      if (snapshot.val()) {
        Properties = snapshot.val();
        if (snapshot.val().host.userID === userID) {
          setAuth(true); // console.log(properties);
        }
      }
    });
  };
  const getUsers = () => {
    const starCountRef = ref(db, "sessions/" + id + "/users");
    onValue(starCountRef, (snapshot) => {
      if (snapshot.val()) {
        Players = Object.values(snapshot.val());
        console.log(Players);
        if (Players) {
          setPlayers(Players);
        }
      }
    });
  };

  //getUsers()
  useEffect(() => {
    console.log(userID);
  
    getUsers();
    console.log(auth);
    //console.log(lobby);
  }, []);
useEffect(() => {
  getRoomProperties();
  //console.log(auth);
}, [players]);
  return (
    <div className="flex flex-col items-center justify-center h-full pt-2">
      <div className="">
        <FlashCard text={"Players"} />
      </div>
      <div className="room-code">
        <FlashCard text={`Room Code : ${id}`} />
      </div>
      <ul className="list-none inline-flex self-center justify-center items-center xs-mobile:flex-wrap md:flex-nowrap">
        {players
          ? players.map((player, index) => (
              <li key={index} className={"inline-block mt-4 p-3"}>
                <FlashCard text={player.name} />
              </li>
            ))
          : console.log(1)}
      </ul>
      { auth ? (
        <Link
          to={{
            pathname: `/round/${1}`,
            state: {
              value: { players },
            },
          }}
        >
          <Button
            display={"bg-btn-bg-primary bg-center btn-lg"}
            text={"Start Game"}
            clickHandler={clickHandler}
          />
        </Link>
      ) : null}
    </div>
  );
};

export default Lobby;
