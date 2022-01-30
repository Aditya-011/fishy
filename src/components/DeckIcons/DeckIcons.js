import React, { useContext, useState } from "react";
import Icons from "../Icons/Icons";
import Modal from "../Modal/Modal";
import { SocketContext } from "../../context/SocketContext";
import Heading from "../Heading";
import Button from "../Button/Button";
import rules_4 from "../../images/rules_guide.png";

const DeckIcons = () => {
  const socket = useContext(SocketContext);
  const [rules, showRules] = useState(false);
  const [quit, showQuit] = useState(false);
  const status = Number(sessionStorage.getItem("status"));
  const clickHandler = () => {
    showRules(true);
  };

  const quitGame = () => {
    showQuit(true);
  };

  const reallyQuitGame = () => {
    socket.emit("quitGame", sessionStorage.getItem('game-code'));
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/game";
  };

  return (
    <div className="flex justify-around flex-row w-full deck">
      <div className="p-2">
        <Icons
          icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/rules-list.png`}
          title={`Rules`}
          clickHandler={clickHandler}
        />
      </div>
      {status === 1 ? (
        <div className="p-2">
          <Icons
            icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/cross.png`}
            title={`Quit`}
            clickHandler={quitGame}
          />
        </div>
      ) : (
        <div></div>
      )}
      {rules ? (
        <Modal>
          <div className="inline-flex justify-end w-full">
            <div className="inline-block">
              <button
                onClick={() => showRules(false)}
                className="text-light text-2xl hover:text-light"
              >
                &times;
              </button>
            </div>
          </div>
          <div className="self-center flex justify-center items-center ml-auto mr-auto">
            <img
              src={rules_4}
              alt="rules"
              className="xs-mobile:h-full md:h-full w-full"
            />
          </div>
        </Modal>
      ) : null}
      {quit ? (
        <Modal>
          <div className="inline-flex justify-end w-full">
            <div className="inline-block ml-auto mr-auto">
              <Heading text={"Quit?"}
              display={`text-warning text-4xl font-bold`}
              />
            </div>
            <div className="inline-block">
              <button
                onClick={() => showQuit(false)}
                className="text-light text-2xl hover:text-light"
              >
                &times;
              </button>
            </div>
          </div>
          <div className="self-center flex justify-center items-center flex-col ml-auto mr-auto">
            <div>
              <Heading
                text={`Are you sure you want to quit the game?`}
                display={`text-warning text-4xl font-bold`}
              />
            </div>
            <div>
              <Button
                clickHandler={reallyQuitGame}
                display={"btn bg-btn-bg-primary btn-lg text-warning border-2 border-yellow"}
                text={"Quit"}
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default DeckIcons;
