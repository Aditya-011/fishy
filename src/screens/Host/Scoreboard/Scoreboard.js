import React, { useState, useEffect, useContext } from "react";
import FlashCard from "../../../components/Flashcard/Flashcard";
import "./Scoreboard.css";
import Icons from "../../../components/Icons/Icons";
import Scores from "../../../components/Scores/Scores";
import { SocketContext } from "../../../context/SocketContext";
import Button from "../../../components/Button/Button";
import { Link ,useNavigate} from "react-router-dom";
import { set, ref, update, get, child, onValue } from "firebase/database";
import { database as db } from "../../../firebase";
import { UserContext } from "../../../context/context";

const Scoreboard = () => {
  const code = sessionStorage.getItem("code");
  const navigate = useNavigate()
  const socket = useContext(SocketContext);
  const [show, setShow] = useState(false);
  const [scoreData, setScores] = useState([]);
  const [playerData, setPlayers] = useState([]);
  const getPlayers = () => {
    get(child(ref(db), `sessions/${code}/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          console.log(data);
          setPlayers(data);
          return
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getPlayersData = () => {
    onValue(ref(db, `sessionData/${code}/state`), (snapshot) => {
      console.log(`sessionData/${code}/state`);
      //  console.log(snapshot.val());
      const data = Object.values(snapshot.val());
      console.log(data);
      setScores(data);
      return
    });
  };
  const waitingRoom = () => {
    const starCountRef = ref(db, `sessionData/${code}/hostProperties`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
    });
  };
  const clickHandler = () => {
    setShow(!show);
    socket.emit("set-visible", sessionStorage.getItem("game-code"));
  };

  useEffect(() => {
    /*  socket.emit("show-scores", sessionStorage.getItem('game-code'));
    socket.on("scores", ({ scores, players }) => {
      setScores(scores);
      setPlayers(players);
    });*/
    getPlayers();
    getPlayersData();
    //waitingRoom();
  }, []);

  const clickHandler2 = () => {
    /* socket.emit("waiting-arena", sessionStorage.getItem('game-code'));*/
    get(child(ref(db), `sessionData/${code}/hostProperties`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          const res = snapshot.val();
          const updates = {};
          updates[`sessionData/${code}/hostProperties`] = {
            ...res,
            movetoWaitingRoom: true,
          };
          update(ref(db), updates);
          if(res.isOver)
          {
            navigate(`/waiting`)
          }
          return
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="md:w-96 xs-mobile:w-9/12">
        <FlashCard text={`Scores`} />
      </div>
      <div className="tables flex justify-center self-center xs-mobile:w-full md:w-5/6 ml-auto mr-auto overflow-y-auto">
        <div className="show-hidden-table">
          <Icons
            icon={
              show
                ? `https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-new.png`
                : `https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-off-new.png`
            }
            clickHandler={clickHandler}
          />
        </div>

        {playerData ? (
          <Scores show={show} scores={scoreData} players={playerData} />
        ) : null}
      </div>
      <Link
        to={{
          pathname: `/waiting`,
          state: {
            value: { playerData },
          },
        }}
      >
      <Button
        text={"Next Round"}
        display={"bg-btn-bg-primary bg-center p-3 mt-2 btn-lg"}
        clickHandler={() => clickHandler2()}
      />
      </Link>
    </div>
  );
};

export default Scoreboard;
