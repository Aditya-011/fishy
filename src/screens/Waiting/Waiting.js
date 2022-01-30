import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "../../components/Button/Button";
import { SocketContext } from "../../context/SocketContext";
import "./Waiting.css";

const Waiting = () => {
  const status = sessionStorage.getItem("status");
  const socket = useContext(SocketContext);
  const [roundNo, setRoundNo] = useState(0);
  const [timeFormat, setTimeFormat] = useState("03:00");
  const timerRef = useRef();
  const [active, setActive] = useState(false);
  const [counter, setCounter] = useState(180);
  const [waitingMsg, setWaitingMsg] = useState("");

  useEffect(() => {
    sessionStorage.removeItem("time-val");
    sessionStorage.removeItem("time-format");
    sessionStorage.removeItem("time-percent");
    if (sessionStorage.getItem("time-forma"))
      setTimeFormat(sessionStorage.getItem("time-format"));
    if (sessionStorage.getItem("active"))
      setActive(JSON.parse(sessionStorage.getItem("active")));
    if (sessionStorage.getItem("counter"))
      setCounter(Number(sessionStorage.getItem("counter")));
    socket.emit("join-game", sessionStorage.getItem("game-code"));
    socket.on("next-round-started", roundNumber => {
      window.location.href = `/round/${roundNumber}`;
    });
    socket.on("round-number", roundNumber => setRoundNo(roundNumber));
    socket.on("message", ({ message }) => setWaitingMsg(message));
    socket.on("game-over", () => (window.location.href = "/gameover"));
    if (active) {
      if (counter > 0) {
        timerRef.current = setInterval(() => {
          const secondCounter = counter % 60;
          const minuteCounter = Math.floor(counter / 60);
          const computedSecond =
            String(secondCounter).length === 1
              ? `0${secondCounter}`
              : secondCounter;
          const computedMinute =
            String(minuteCounter).length === 1
              ? `0${minuteCounter}`
              : minuteCounter;
          setTimeFormat(computedMinute + ":" + computedSecond);
          sessionStorage.setItem(
            "time-format",
            computedMinute + ":" + computedSecond
          );
          setCounter(counter => counter - 1);
          sessionStorage.setItem("active", true);
          sessionStorage.setItem("counter", counter - 1);
        }, 1000);
      } else {
        setCounter(0);
        setTimeFormat("00:00");
      }
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [socket, active, counter]);

  const startGame = () => {
    sessionStorage.removeItem("time-format");
    sessionStorage.removeItem("active");
    sessionStorage.removeItem("counter");
    socket.emit("start-next-round", sessionStorage.getItem("game-code"));
  };

  const endGame = () => {
    socket.emit("game-over", sessionStorage.getItem("game-code"));
    window.location.href = "/gameover";
  };

  const skipGameRound = () => {
    sessionStorage.removeItem("time-format");
    sessionStorage.removeItem("active");
    sessionStorage.removeItem("counter");
    socket.emit("skip-round", sessionStorage.getItem("game-code"));
    socket.on("skipped-round-number", roundNumber => setRoundNo(roundNumber));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-auto">
        <h1 className="text-yellow-800 bg-yellow-400 px-3 pt-3 pb-2 rounded-lg text-md mb-0">
          {"Waiting Arena"}{" "}
        </h1>
      </div>
      <div className="bg-card bg-no-repeat bg-cover">
        {(roundNo === 5 || roundNo === 8 || roundNo === 10) &&
        status === "1" ? (
          <div className="flex flex-col w-full justify-center items-center pt-3">
            <h1 className="text-2xl text-warning font-bold px-4">
              {!active
                ? "Start the discussion for team leaders!"
                : "Discussion started!"}
            </h1>
            <button
              onClick={() => {
                sessionStorage.setItem("active", !active);
                setActive(!active);
              }}
              className="text-warning self-center text-8xl bg-black rounded-full px-3 py-3"
            >
              {timeFormat}
            </button>
          </div>
        ) : null}
        {status === "1" ? (
          roundNo < 11 ? (
            <div className="flex flex-row justify-center items-center py-10 px-10 w-full">
              <div>
                <button
                  onClick={startGame}
                  className="skip-btn btn-lg"
                >{`Go to Day ${roundNo}`}</button>
              </div>
              <div>
                <button
                  onClick={skipGameRound}
                  className="skip-btn btn-lg ml-5"
                >{`Skip Day ${roundNo}`}</button>
              </div>
            </div>
          ) : (
            <Button
              text={`End Game`}
              display={"bg-btn-bg-primary p-4"}
              clickHandler={endGame}
            />
          )
        ) : (
          <div className="flex flex-col">
            <h1 className="text-warning text-2xl font-bold px-10 pt-10">
              Waiting for the host to start the next round
            </h1>
            <p className="self-center text-white my-2 text-xl">{waitingMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Waiting;
