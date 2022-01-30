import React, { useState, useContext, useEffect } from "react";
import FlashCard from "../../../components/Flashcard/Flashcard";
import ShowOptions from "../ShowOptions/ShowOptions";
import Fish1 from "../../../images/Fish1-new.png";
import Fish2 from "../../../images/Fish2-new.png";
import Icons from "../../../components/Icons/Icons";
import "./RevealScores.css";
import { SocketContext } from "../../../context/SocketContext";
import Button from "../../../components/Button/Button";
import { Link, useParams } from "react-router-dom";
import DeckIcons from "../../../components/DeckIcons/DeckIcons";

const RevealScores = () => {
  const roundNo = useParams();
  const socket = useContext(SocketContext);
  const code = sessionStorage.getItem('game-code')
  const [players, setPlayers] = useState([]);

  const clickHandler = playerName => {
    socket.emit("show", {playerName, code});
  };

  useEffect(() => {
    socket.emit("options", (sessionStorage.getItem("game-code")));
    socket.on("updated-players", updatedPlayers => setPlayers(updatedPlayers))
    sessionStorage.removeItem('time-val')
    sessionStorage.removeItem('time-format')
    
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center pt-1 h-screen reveal">
      <div className="md:w-96 xs-mobile:w-9/12">
        <FlashCard text={`Day ${roundNo.id}`} />
      </div>
      <div className="flex mt-4 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center">
        {players && players.map((player, index) => {
          console.log(player.name);
          if (player.eye) {
            return (
              <div className="inner-div flex flex-col md:p-1" key={index}>
                <div className="xs-mobile:w-4/6 mobile:w-full w-full self-center ml-auto mr-auto">
                  <FlashCard text={player.name} />
                </div>
                {player.eye ? (
                  <div key={index} className="">
                    <Icons
                      icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-new.png`}
                      title={"Show"}
                      clickHandler={() => clickHandler(player.name)}
                    />
                  </div>
                ) : (
                  <div key={index} className="">
                    <Icons
                      icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-off-new.png`}
                      title={"Hide"}
                      clickHandler={() => clickHandler(player.name)}
                    />
                  </div>
                )}
                {Number(player.choice) === 1 ? (
                  <div className="xs-mobile:ml-auto xs-mobile:mr-auto mt-3">
                    <ShowOptions fishes={Fish1} />
                  </div>
                ) : (
                  <div className="xs-mobile:ml-auto xs-mobile:mr-auto mt-3">
                    <ShowOptions fishes={Fish2} />
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div key={index} className="inner-div flex flex-col md:p-1">
                <div>
                  <FlashCard text={player.name} />
                  <Icons
                    icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-off-new.png`}
                    clickHandler={() => clickHandler(player.name)}
                  />
                </div>
                <div className="mt-3 xs-mobile:ml-auto xs-mobile:mr-auto">
                  <ShowOptions />
                </div>
              </div>
            );
          }
        })}
      </div>
      <Link to="/host/scores">
        <Button
          text={"Scores"}
          display={"bg-btn-bg-primary bg-center btn-lg mt-3"}
        />
      </Link>

      <div className="flex items-end justify-between h-full w-full mt-4 xs-mobile:mt-5">
        <DeckIcons />
      </div>
    </div>
  );
};

export default RevealScores;
