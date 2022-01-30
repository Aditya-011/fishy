import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button/Button";
import DeckIcons from "../../../components/DeckIcons/DeckIcons";
import FishOptions from "../../../components/FishOptions/FishOptions";
import FlashCard from "../../../components/Flashcard/Flashcard";
import Icons from "../../../components/Icons/Icons";
import Modal from "../../../components/Modal/Modal";
import Timer from "../../../components/Timer/Timer";
import { SocketContext } from "../../../context/SocketContext";
import Fish1 from "../../../images/Fish1-new.png";
import Fish2 from "../../../images/Fish2-new.png";
import "./GameRounds.css";
import three from "../../../images/three.png";
import five from "../../../images/five.png";
import ten from "../../../images/ten.png";

const GameRounds = () => {
  const timeP = useRef(120);
  const roundNo = useParams();
  let multiplier = useRef(0);
  const socket = useContext(SocketContext);
  const timerRef = useRef();
  const [time, setTime] = useState(120);
  const [timeFormat, setTimeFormat] = useState();
  const [timePercent, setTimePercent] = useState();
  const [choice, setChoice] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const [active, setActive] = useState([false, false]);
  const [score, showScore] = useState(false);
  const [pause, setPause] = useState(false);
  const [indivScore, setIndivScore] = useState([]);
  let timerID = useRef(null);
  let playerName = sessionStorage.getItem("playerName");
  let code = sessionStorage.getItem("game-code");

  useEffect(() => {
    console.log("Inside use Effect");
    socket.emit("join-players", { code, playerName });
    socket.on("choice", choice => {
      choice === 1 ? setActive([true, false]) : setActive([false, true]);
      setDisabled(true);
      setChoice(choice);
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

    socket.on("pause-status", bool => setPause(bool));
    socket.on("disabled-status", bool => setDisabled(bool));
    socket.on("indivScore", indivScore => setIndivScore(indivScore));
    socket.on("showChoices", () => {
      sessionStorage.removeItem("time-format");
      sessionStorage.removeItem("time-percent");
      sessionStorage.removeItem("time-val");
      window.location.href = `/player/results/${roundNo.id}`;
    });

    socket.on("quit-game", () => {
      console.log("Hi");
      window.location.href = "/game";
    });

    socket.on("updateChoice", updatedChoice => {
      console.log("updated choice", updatedChoice);
      if (updatedChoice.name === playerName) {
        setChoice(updatedChoice.choice);
      }
    });
    return () => {
      sessionStorage.removeItem("time-format");
      sessionStorage.removeItem("time-percent");
      sessionStorage.removeItem("time-val");
    };
  }, [socket, roundNo, playerName, code, choice]);

  useEffect(() => {
    let active = false;
    if (!active && !pause) {
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
        socket.emit("submit", { choice, playerName, code });
        setDisabled(true);
        Number(choice) === 1
          ? setActive([true, false])
          : setActive([false, true]);
        sessionStorage.setItem("time-val", 0);
        sessionStorage.setItem("time-format", "0:00");
      }
    }

    return () => {
      clearInterval(timerRef.current);
      active = true;
    };
  }, [timerRef, time, pause, choice, code, playerName, socket]);

  useEffect(() => {
    socket.on("pause", () => {
      setPause(true);
      setDisabled(true);
    });
    socket.on("resume", () => {
      setPause(false);
      setDisabled(false);
    });
  }, [socket, time]);

  const selectChoice = num => {
    num === 1 ? setActive([true, false]) : setActive([false, true]);
    setChoice(num);
    console.log("choice made", num);
    socket.emit("toggle", { num, playerName, code });
  };

  const submitChoice = () => {
    socket.emit("submit", { choice, playerName, code });
    clearInterval(timerID);
    setDisabled(true);
    Number(choice) === 1 ? setActive([true, false]) : setActive([false, true]);
  };

  const captureClick = () => {
    if (disabled) {
      console.log(choice);
    } else {
      setActive([false, false]);
    }
  };

  if (Number(roundNo.id) === 5) {
    multiplier.current = <img src={three} alt="3x" />;
  } else if (Number(roundNo.id) === 8) {
    multiplier.current = <img src={five} alt="5x" />;
  } else if (Number(roundNo.id) === 10) {
    multiplier.current = <img src={ten} alt="10x" />;
  }

  return (
    <div className="p-1 mt-1 flex flex-col h-screen game">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row md:w-96 xs-mobile:w-9/12">
          <FlashCard text={`Day ${roundNo.id}`} />
          {Number(roundNo.id) === 5 ||
          Number(roundNo.id) === 8 ||
          Number(roundNo.id) === 10 ? (
            <p className="rounded-full text-center px-2 py-2 ml-2 border-5 border-yellow-300">
              {multiplier.current}
            </p>
          ) : null}
        </div>
        <Timer time={timeFormat} completed={timePercent} />
      </div>
      <div
        className="flex mt-2 md:flex-nowrap justify-center items-center overflow-y-hidden"
        onClickCapture={() => captureClick()}
      >
        <div className={`p-3`}>
          <FishOptions
            fishes={Fish1}
            active={active[0]}
            SelectChoice={disabled ? null : selectChoice}
            id={1}
          />
        </div>
        <div className={`p-3`}>
          <FishOptions
            fishes={Fish2}
            active={active[1]}
            SelectChoice={disabled ? null : selectChoice}
            id={2}
          />
        </div>
      </div>
      {disabled ? (
        <button
          className="text-warning bg-btn-bg-primary btn-lg bg-center w-25 self-center disabled:opacity-50 cursor-default"
          disabled
        >
          Submit
        </button>
      ) : (
        <Button
          text={"Submit"}
          clickHandler={submitChoice}
          display={"bg-btn-bg-primary bg-center btn-lg w-25 self-center"}
        />
      )}
      <div className="absolute md:top-1/4 md:right-12 xs-mobile:top-44 xs-mobile:right-8">
        <Icons
          icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/coins.png`}
          clickHandler={() => showScore(!score)}
          title="Coins"
        />
        <p
          style={{
            color: `var(--btn-bg-secondary)`,
            textAlign: `center`,
            fontWeight: `700`,
          }}
        >
          {indivScore &&
            indivScore.reduce((acc, value) => {
              return acc + value;
            }, 0)}
        </p>
      </div>
      <DeckIcons />
      {score ? (
        <Modal>
          <div className="inline-flex justify-end w-full relative">
            <div className="inline-flex self-start mr-auto">
              <img
                src={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/coins.png`}
                alt="coins"
              />
              <div className="self-end ml-1 mr-auto">
                <p style={{ color: `var(--primary-text)`, fontWeight: `500` }}>
                  {indivScore.reduce((acc, value) => {
                    return acc + value;
                  }, 0)}
                </p>
              </div>
            </div>
          </div>
          <ul className="scores">
            <li className="titles grid-display">
              {indivScore.map((value, index) => {
                return (
                  <p key={index} className="grid-item">
                    {`# ${index + 1}`}
                  </p>
                );
              })}
            </li>
            <li className="grid-display">
              {indivScore.map((value, index) => {
                return (
                  <p key={index} className="grid-display-item">
                    {value}
                  </p>
                );
              })}
            </li>
          </ul>
          <div className="close-btn">
            <Icons
              icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/cross.png`}
              title={"Quit"}
              clickHandler={() => showScore(!score)}
            />
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default GameRounds;
