import React, { useState, useEffect, useContext } from "react";
import FlashCard from "../../../components/Flashcard/Flashcard";
import "./Scoreboard.css";
import Scores from "../../../components/Scores/Scores";
import { SocketContext } from "../../../context/SocketContext";

const Scoreboard = () => {
  const socket = useContext(SocketContext);

  const [scoreData, setScores] = useState([]);
  const [playerData, setPlayers] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    socket.emit("join-scores", sessionStorage.getItem('game-code'));
    socket.on("scores", ({ scores, players }) => {
      console.log(scores, players);
      setScores(scores);
      setPlayers(players);
    });
    socket.on("set-visible", () => {
      setShow(!show);
    });
    socket.on("join-waiting", () => {
      window.location.href = `/waiting`;
    });
    socket.on("end-game", () => {
      sessionStorage.clear()
      
      window.location.href = `/gameover`});
  }, [socket, show, scoreData.length]);
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
