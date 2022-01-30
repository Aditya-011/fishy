import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import FlashCard from "../../components/Flashcard/Flashcard";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import "./Lobby.css";

const Lobby = () => {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState([]);
  let status = Number(sessionStorage.getItem("status"));
  const clickHandler = () => {
    socket.emit("start-game", sessionStorage.getItem("game-code"));
  };

  useEffect(() => {
    let isMounted = true;
    console.log(status);
    if (isMounted) {
      socket.emit("join-lobby", sessionStorage.getItem("game-code"));

      socket.on("players", playerData => {
        setPlayers(playerData);
      });

      socket.on("start", () => {
        window.location.href = "/round/1";
      });
    }

    return () => {
      isMounted = false;
      setPlayers([]);
    };
  }, [socket, status]);

  return (
    <div className="flex flex-col items-center justify-center h-full pt-2">
      <div className="">
        <FlashCard text={"Players"} />
      </div>
      <div className="room-code">
        <FlashCard
          text={`Room Code : ${sessionStorage.getItem("game-code")}`}
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
