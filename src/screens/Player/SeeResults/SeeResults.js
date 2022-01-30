import React, { useState, useContext, useEffect } from "react";
import ShowOptions from "../../Host/ShowOptions/ShowOptions";
import Fish1 from "../../../images/Fish1-new.png";
import Fish2 from "../../../images/Fish2-new.png";
import FlashCard from "../../../components/Flashcard/Flashcard";
import { SocketContext } from "../../../context/SocketContext";
import { useParams } from "react-router-dom";

const SeeResults = () => {
  let roundNo = useParams();
  const [players, setPlayers] = useState([]);
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.emit("new-room", sessionStorage.getItem('game-code'));
    socket.on("updated-players", updatedPlayers => {
      setPlayers(updatedPlayers);
    });
    socket.on(
      "come-to-scores",
      () => (window.location.href = "/player/scores")
    );

    socket.on("quit-game", () => {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/game";
    });
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center pt-1">
      <div className="md:w-96 xs-mobile:w-9/12">
        <FlashCard text={`Day ${roundNo.id}`} />
      </div>
      <div className="flex mt-4 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center">
        {players && players.map((player, index) => {
          return (
            <div className="inner-div flex flex-col md:p-1" key={index}>
              <div className="xs-mobile:w-4/6 mobile:w-full w-full self-center ml-auto mr-auto">
                <FlashCard text={player.name} />
              </div>
              {player.eye ? (
                <div className="mt-3 xs-mobile:ml-auto xs-mobile:mr-auto">
                  {Number(player.choice) === 2 ? (
                    <ShowOptions fishes={Fish2} />
                  ) : (
                    <ShowOptions fishes={Fish1} />
                  )}
                </div>
              ) : (
                <div className="mt-3 xs-mobile:ml-auto xs-mobile:mr-auto">
                  <ShowOptions />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeeResults;
