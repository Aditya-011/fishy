import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import FlashCard from "../../components/Flashcard/Flashcard";
import Button from "../../components/Button/Button";
import { Link,useParams } from "react-router-dom";
import { UserContext } from "../../context/context";
import "./Lobby.css";
import { ref, child, get, push, update } from "firebase/database";

const Lobby = () => {
  const socket = useContext(SocketContext);
  let { id } = useParams();
  const [players, setPlayers] = useState([]);
  const userID = useContext(UserContext);
  let status = Number(sessionStorage.getItem("status"));
  const clickHandler = () => {
    socket.emit("start-game", sessionStorage.getItem("game-code"));
  };

  useEffect(() => {
  console.log(userID);

  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full pt-2">
      <div className="">
        <FlashCard text={"Players"} />
      </div>
      <div className="room-code">
        <FlashCard
          text={`Room Code : ${id}`}
        />
      </div>
      <ul className="list-none inline-flex self-center justify-center items-center xs-mobile:flex-wrap md:flex-nowrap">
        {players.map((player, index) => (
          <li key={index} className={"inline-block mt-4 p-3"}>
            <FlashCard text={player} />
          </li>
        ))}
      </ul>
      {status === 1 && players.length === 4 ? (
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
