import React, { useState, useEffect, useContext } from "react";
import Button from "../../../components/Button/Button";
import { SocketContext } from "../../../context/SocketContext";
import "./PlayerScreen.css";

const PlayerScreen = () => {
  const socket = useContext(SocketContext);
  const [inputCode, setInputCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [code, correctCode] = useState(false);
  useEffect(() => {
    sessionStorage.setItem("status", 0);
    socket.on("error", ({ message }) => {
      if (!code) {
        alert(message);
        correctCode(true);
      }
    });
  }, [socket, code]);

  const handlegameLink = e => {
    let xCode=e.target.value;
    let result = xCode.toLocaleUpperCase();
    setInputCode(result);
  };

  const handleName = e => {
    setPlayerName(e.target.value);
  };

  const enterGame = () => {
    console.log("Enter game");
    console.log(socket.id);
    socket.emit("authenticate", { inputCode, playerName, id: socket.id });
    socket.on("authenticated", value => {
      if (value === 1) {
        sessionStorage.setItem("game-code", inputCode);
        window.location.href = `/lobby/${inputCode}`;
        correctCode(true);
      } else {
        console.log(value);
        if (!code) {
          alert("Wrong code");
          correctCode(true);
        }
      }
    });
    socket.on("change", ({ message }) => alert(message));
    sessionStorage.setItem("playerName", playerName);
  };

  return (
    <div className="flex flex-col bg-card bg-no-repeat bg-cover bg-blend-screen rounded-none px-8 pt-6 pb-8 h-full">
      <div className="mb-4">
        <label
          htmlFor="Code"
          className="block text-yellow-500 text-base font-bold mb-2 py-3 "
        >
          Room Code :
        </label>
        <input
          type="text"
          placeholder="Eg:12345"
          value={inputCode}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={e => handlegameLink(e)}
          required
        ></input>
      </div>

      <div className="mb-6">
        <label
          className="block text-yellow-500 text-base font-bold mb-2 py-3"
          htmlFor="Code"
        >
          Team Name :
        </label>
        <input
          type="text"
          placeholder="Eg:David"
          value={playerName}
          onChange={e => handleName(e)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        ></input>
      </div>
      <div className="self-center join-btn">
        <Button
          display={`bg-btn-primary`}
          text="Join"
          clickHandler={enterGame}
        />
      </div>
    </div>
  );
};

export default PlayerScreen;
