import React, { useState, useContext, useEffect } from "react";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button/Button";
import FlashCard from "../../../components/Flashcard/Flashcard";
import { SocketContext } from "../../../context/SocketContext";
import { Link } from "react-router-dom";
import Modal from "../../../components/Modal/Modal";
import Settings from "../Settings/Settings";
import Icons from "../../../components/Icons/Icons";
import Rules from "../../Rules/Rules";
import NavComponent from "../../../components/NavComponent";
import Tab from "react-bootstrap/Tab";
import "./GenerateLink.css";
import Refresh from "../../../images/refresh.png";
import SettingIcon from "../../../images/settings.png";

const GenerateLink = () => {
  const socket = useContext(SocketContext);
  const [code, setCode] = useState("");
  const [settings, showSettings] = useState(false);
  const [rules, showRules] = useState(false);
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    socket.emit('settings')
    socket.on('code', code => setCode(code))
    sessionStorage.setItem("status", 1);
  },[socket]);

  const generateCode = () => {
    socket.emit('refresh')
    socket.on('refresh-code', code => setCode(code))
  };

  const ruleHandler = () => {
    showRules(!rules);
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-col justify-center items-start w-full">
        <div className="block mt-2">
          {sessionStorage.getItem('status') === '1'?
          <Icons
            icon={SettingIcon}
            clickHandler={() => showSettings(!settings)}
            title = {'Settings'}
          />
          : null}
        </div>
        <div className="inline-block ml-auto mr-auto mt-3">
          <FlashCard text={"Fishy Equilibrium"} />
        </div>
      </div>
      <div className="max-w-7xl self-center ml-auto mr-auto">
        <NavComponent ekey="profile">
          <Tab eventKey="profile" title="Host" tabClassName="w-100 flex-grow-1">
            {code ? (
              <div className="flex flex-row justify-center items-center p-8">
                <Heading
                  text={`Room Code: ${code}`}
                />
                <Icons
                  icon={Refresh}
                  title={"Refresh"}
                  clickHandler={generateCode}
                />
              </div>
            ) : (
              null
            )}
          </Tab>
        </NavComponent>
      </div>
      {code ? (
        <div className='m-auto mt-5'>
        <Link
          to={{
            pathname: `/lobby/${code}`,
            aboutProps: {
              value: { code },
            },
          }}
        >
          <Button
            display={
              "bg-btn-bg-primary text-warning"
            }
            text={"Next"}
            clickHandler={() => sessionStorage.setItem('game-code', code)}
          />
        </Link>
        </div>
      ) : null}

      <div className="flex justify-around items-end h-full flex-row w-full">
        <div className="p-2">
          <Icons
            icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/rules-list.png`}
            title={`Rules`}
            clickHandler={ruleHandler}
          />
        </div>
        <div></div>
      </div>
      
      {settings ? (
        <Modal>
          <Settings showSettings={() => showSettings(false)} 
          gameCode = {code}  timer={timer} setTimer={setTimer} />
        </Modal>
      ) : null}

      {rules ? (
        <Modal>
          <Rules showRules={() => showRules(false)} />
        </Modal>
      ) : null}
    </div>
  );
};

export default GenerateLink;
