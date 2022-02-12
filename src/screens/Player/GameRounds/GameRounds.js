import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { set, ref, get, child, update, onValue } from "firebase/database";
import { database as db } from "../../../firebase";
import { UserContext } from "../../../context/context";
import { useTimer } from "react-timer-hook";

const GameRounds = () => {
  const timeP = useRef(120);
  const roundNo = useParams();
  const navigate = useNavigate();

  let multiplier = useRef(0);
  const socket = useContext(SocketContext);
  const timerRef = useRef();
  const [time, setTime] = useState(120);
  const [timeFormat, setTimeFormat] = useState();
  const [timePercent, setTimePercent] = useState();
  const [choice, setChoice] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [active, setActive] = useState([false, false]);
  const [score, showScore] = useState(false);
  const [paused, setPause] = useState(false);
  const [indivScore, setIndivScore] = useState([]);
  let timerID = useRef(null);
  let playerName = sessionStorage.getItem("playerName");
  let { code, userID, round } = useContext(UserContext);

  const getTimer =()=>
  {
    get(child(ref(db),`sessions/${code}/properties`)).then((snapshot) => {
      if (snapshot.exists()) {
      const res = Object.values(snapshot.val())
      setTime(res[3])
      //console.log(res);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    
  }

  const checkIfOver = () => {
    const starCountRef = ref(db, `sessionData/${code}/hostProperties/isOver`);
    onValue(starCountRef, (snapshot) => {
      const isOver = snapshot.val();
      //console.log(data);
      if (isOver) {
        navigate(`/player/results/${roundNo.id}`);
      }
    });
  };
  useEffect(() => {
    console.log(code);
    console.log(roundNo);
    getTimer()
    console.log(time);
    console.log("sessionData/" + code + "/eye/" + userID);
    checkIfOver();
    if (roundNo.id > 10) {
      navigate(`/gameover`);
    } else if (code && userID) {
      get(child(ref(db), `users/${userID}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const name = snapshot.val().name;
            console.log(name);
            set(
              ref(db, "sessionData/" + code + "/hostProperties/eye/" + userID),
              {
                isTrue: false,
              }
            );
            set(
              ref(
                db,
                "sessionData/" + code + "/state/" + roundNo.id + "/" + userID
              ),
              {
                eye: false,
                name,
                indivScore: 0,
                isSelected: {
                  status: false,
                  choice: 0,
                },
                isSubmit: {
                  status: false,
                  choice: 0,
                },
              }
            );
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });

      setChoice(0);
      setDisabled(false);
      setActive([false, false]);
    }
  }, [round]);

  const selectChoice = (num) => {
    num === 1 ? setActive([true, false]) : setActive([false, true]);
    setChoice(num);
    console.log("choice made", num);
    const dbRef = ref(db);
    get(
      child(
        dbRef,
        "sessionData/" + code + "/state/" + roundNo.id + "/" + userID + "/"
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val();
          //  data.isSelected.status = true
          // data.isSelected.choice=num
          const updates = {};
          updates[
            "sessionData/" + code + "/state/" + roundNo.id + "/" + userID
          ] = {
            ...data,
            isSelected: {
              choice: num,
              status: true,
            },
          };
          console.log(snapshot.val());
          update(ref(db), updates);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    //  socket.emit("toggle", { num, playerName, code });
  };

  const submitChoice = () => {
    //socket.emit("submit", { choice, playerName, code });
    //cearInterval(timerID);
    const dbRef = ref(db);
    get(
      child(
        dbRef,
        "sessionData/" + code + "/state/" + roundNo.id + "/" + userID + "/"
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val();
          //  data.isSelected.status = true
          // data.isSelected.choice=num
          const updates = {};
          updates[
            "sessionData/" + code + "/state/" + roundNo.id + "/" + userID
          ] = {
            ...data,
            isSubmit: {
              choice,
              status: true,
            },
          };
          console.log(snapshot.val());
          update(ref(db), updates);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
        <Timer completed={timePercent} round={roundNo.id} timer={time} />
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
        <div>
          <button
            className="text-warning bg-btn-bg-primary btn-lg bg-center w-25 self-center disabled:opacity-50 cursor-default"
            disabled
          >
            Submit
          </button>
          {
            // REMOVE ME
          }
          <Link
            to={{
              pathname: `/round/${Number(roundNo.id) + 1}`,
            }}
          >
            <Button
              display={"bg-btn-bg-primary bg-center btn-lg"}
              text={"Start Game"}
            />
          </Link>
        </div>
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
