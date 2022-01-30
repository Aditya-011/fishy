import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
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
import "./Discussion.css";

const Discussion = () => {
  const roundNo = useParams();
  const code = sessionStorage.getItem("game-code");
  const timeP = useRef(120);
  const socket = useContext(SocketContext);
  const [time, setTime] = useState(120);
  const [timeFormat, setTimeFormat] = useState("0:00");
  const [timePercent, setTimePercent] = useState(0);
  const [playerInfo, setPlayerInfo] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [mode, setMode] = useState(false);
  let timerRef = useRef();

  const pauseButton = () => {
    socket.emit("pause", sessionStorage.getItem("game-code"));
    setMode(true);
  };

  const resumeButton = () => {
    socket.emit("resume", sessionStorage.getItem("game-code"));
    setMode(false);
  };

  useEffect(() => {
    socket.emit("join-host", code);
    socket.on("toggled", playerData => {
      setPlayerInfo(playerData);
    });
    socket.on("chosen", playerData => {
      setPlayerInfo(playerData);
    });

    // socket.on("updateChoice", updatedChoice => {
    //   console.log("updated choice", updatedChoice);
    //   alert(updatedChoice);
    // });

    socket.on("stop-timer", () => {
      setTimeFormat("0:00");
      setTimePercent(0);
      setTime(0);
      setDisabled(false);
    });

    socket.on("new-timer", newTimer => {
      if (!sessionStorage.getItem("time-val")) {
        setTime(newTimer);
      }
      timeP.current = newTimer;
    });
    
    if (sessionStorage.getItem("time-format")) {
      if (sessionStorage.getItem("time-val")) {
        setTime(Number(sessionStorage.getItem("time-val")));
        setTimeFormat(sessionStorage.getItem("time-format"));
      }
    }

    socket.on("pause-status", bool => setMode(bool));
    socket.on("player-values", players => setPlayerInfo(players));
  }, [socket, code]);

  useEffect(() => {
    if (sessionStorage.getItem("time-format")) {
      if (sessionStorage.getItem("time-val")) {
        setTime(Number(sessionStorage.getItem("time-val")));
        setTimeFormat(sessionStorage.getItem("time-format"));
      }
    }
    let active = false;
    if (!active && !mode) {
      console.log(time);
      if (time !== 0) {
        timerRef.current = setInterval(() => {
          const secondCounter = time % 60;
          const minuteCounter = Math.floor(time / 60);
          setTime(time - 1);
          sessionStorage.setItem("time-val", time - 1);
          const computedSecond =
            String(secondCounter).length === 1
              ? `0${secondCounter}`
              : secondCounter;
          const computedMinute =
            String(minuteCounter).length === 1
              ? `0${minuteCounter}`
              : minuteCounter;
          sessionStorage.setItem(
            "time-format",
            computedMinute + ":" + computedSecond
          );
          setTimeFormat(computedMinute + ":" + computedSecond);
          let originalTime = timeP.current;
          // console.log(timeP.current);
          // console.log(time);
          const percent = 100 - ((originalTime - time) / originalTime) * 100;
          // console.log(percent);
          setTimePercent(percent);
        }, 1000);
      } else {
        setTime(0);
        setTimeFormat("0:00");
        setTimePercent(0);
        sessionStorage.setItem("time-val", 0);
        sessionStorage.setItem("time-format", "0:00");
      }
    }

    return () => {
      clearInterval(timerRef.current);
      active = true;
    };
  }, [timerRef, time, mode]);

  const selectChoice = (num, playerName) => {
    // num === 1 ? setActive([true, false]) : setActive([false, true]);
    // setChoice(num)
    console.log(playerName, num);
    socket.emit("submit", { choice: num, playerName, code });
  };

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
          {!mode ? (
            <Icons clickHandler={pauseButton} icon={Pause} />
          ) : (
            <Icons clickHandler={resumeButton} icon={Resume} />
          )}
        </div>
      </div>
      <div className="flex mt-2 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center">
        {playerInfo &&
          playerInfo.map(p => (
            <div className="yo p-2" key={Math.random()}>
              <FlashCard text={p.name} />
              <ChoiceAndSubmit
                choice={p.choice}
                toggle={p.toggle}
                submitHostChoice={num => selectChoice(num, p.name)}
                time={time}
                paused={mode}
              />
            </div>
          ))}
      </div>
      <div className="results">
        {disabled ? (
          <button
            className="bg-btn-bg-primary p-3 text-warning btn-lg disabled:opacity-60 cursor-default"
            disabled
          >
            Results
          </button>
        ) : (
          <Link
            to={{
              pathname: `/host/results/${roundNo.id}`,
              state: {
                value: { playerInfo },
              },
            }}
          >
            <Button
              text={"Results"}
              display={"bg-btn-bg-primary p-3 bg-center btn-lg"}
            />
          </Link>
        )}
      </div>

      <div className="flex items-end justify-between h-full w-full">
        <DeckIcons />
      </div>
    </div>
  );
};

export default Discussion;
