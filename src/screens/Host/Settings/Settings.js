import React, { useContext, useState } from "react";
import Button from "../../../components/Button/Button";
import Heading from "../../../components/Heading";
import { SocketContext } from "../../../context/SocketContext";
import "./Settings.css";

const Settings = ({ showSettings, gameCode,timer,setTimer }) => {
  const socket = useContext(SocketContext);
  
  const getTimer = e => {
    setTimer(e.target.value);
  };

  const saveChanges = () => {
    socket.emit("set-timer", {timer, gameCode});
    showSettings(false);
  };

  return (
    <div className="flex flex-col settings">
      <div className="inline-flex justify-end">
        <div className="ml-auto mr-auto inline-block">
          <Heading
            text={"Settings"}
            display={"md:text-2xl xs-mobile:text-lg text-warning"}
          />
        </div>
        <div className="inline-block">
          <button
            onClick={() => showSettings(false)}
            className="text-light text-2xl hover:text-light"
          >
            &times;
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center p-5">
        <label
          htmlFor="timer"
          className="text-warning md:text-xl xs-mobile:text-lg p-5"
        >
          Set Timer
        </label>
        <input
          type="text"
          onChange={e => getTimer(e)}
          placeholder="Set time"
          value={timer}
          className="inp"
          name="timer"
        />
      </div>
      <Button
        text={"Save"}
        display={`btn btn-warning btn-lg btn-bg-secondary ml-auto mr-auto `}
        clickHandler={saveChanges}
      />
    </div>
  );
};

export default Settings;
