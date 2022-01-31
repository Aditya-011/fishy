import React, { useState, useContext, useEffect } from "react";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button/Button";
import FlashCard from "../../../components/Flashcard/Flashcard";
import { SocketContext } from "../../../context/SocketContext";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/context";
import Modal from "../../../components/Modal/Modal";
import Settings from "../Settings/Settings";
import Icons from "../../../components/Icons/Icons";
import Rules from "../../Rules/Rules";
import NavComponent from "../../../components/NavComponent";
import Tab from "react-bootstrap/Tab";
import "./GenerateLink.css";
import Refresh from "../../../images/refresh.png";
import SettingIcon from "../../../images/settings.png";
import { database as db } from "../../../firebase";
import { ref, set, get, child } from "firebase/database";

const GenerateLink = ({ code, setcode }) => {
  const userID = useContext(UserContext);
  const [settings, showSettings] = useState(false);
  const [rules, showRules] = useState(false);
  const [timer, setTimer] = useState(120);

  const checkIfExists = () => {
    const dbRef = ref(db);

    get(child(dbRef, `sessions/${code}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
         // console.log(snapshot.val());
          setcode(generateCode(7));
          checkIfExists();
        } else {
          return;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    sessionStorage.setItem("status", 1);
    setcode(generateCode(7));
  }, []);

  const createRoom = () => {
    checkIfExists();
    console.log(userID);

    set(ref(db, "sessions/" + code), {
      users: {
        [userID]: {
          name: "Logan",
          role: "host",
        },
      },
      properties: {
        timer,
      },
    });

    console.log("host added");
  };
  function generateCode(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // console.log(result);
    return result;
  }

  //console.log(makeid(7));

  const ruleHandler = () => {
    showRules(!rules);
  };
  //const code = generateCode(7);
  console.log(code);
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-col justify-center items-start w-full">
        <div className="block mt-2">
          {sessionStorage.getItem("status") === "1" ? (
            <Icons
              icon={SettingIcon}
              clickHandler={() => showSettings(!settings)}
              title={"Settings"}
            />
          ) : null}
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
                <Heading text={`Room Code: ${code}`} />
                <Icons
                  icon={Refresh}
                  title={"Refresh"}
                  clickHandler={generateCode(7)}
                />
              </div>
            ) : null}
          </Tab>
        </NavComponent>
      </div>
      {code ? (
        <div className="m-auto mt-5">
          <Link
            to={{
              pathname: `/lobby/${code}`,
              aboutProps: {
                value: { code },
              },
            }}
          >
            <Button
              display={"bg-btn-bg-primary text-warning"}
              text={"Next"}
              clickHandler={() => {
                sessionStorage.setItem("game-code", code);
                createRoom();
              }}
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
          <Settings
            showSettings={() => showSettings(false)}
            gameCode={code}
            timer={timer}
            setTimer={setTimer}
          />
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
