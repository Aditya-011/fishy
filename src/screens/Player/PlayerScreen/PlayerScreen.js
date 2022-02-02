import React, { useState, useEffect, useContext } from "react";
import Button from "../../../components/Button/Button";
import { UserContext } from '../../../context/context';
import "./PlayerScreen.css";
import { database as db } from "../../../firebase";
import { ref, child, get, push, update } from "firebase/database";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const PlayerScreen = () => {
  const navigate = useNavigate()
  const userID = useContext(UserContext);
  const [inputCode, setInputCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  useEffect(() => {
    sessionStorage.setItem("status", 0);
    console.log(userID);
    /*   socket.on("error", ({ message }) => {
      if (!code) {
        alert(message);
        correctCode(true);
      }
    });*/
  }, []);

  /*const handlegameLink = e => {
    let xCode=e.target.value;
    let result = xCode.toLocaleUpperCase();
    setInputCode(result);
  };
*/
  /* const handleName = e => {
    setPlayerName(e.target.value);
  };*/

  const enterGame = async () => {
    /* console.log("Enter game");
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
    */

    // check for room in rdb
    if (inputCode.length && playerName.length) {
      const dbRef = ref(db);
      console.log(inputCode);
      get(child(dbRef, `sessions/${inputCode}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            const newUser = {
              name: playerName,
              role: "player",
              rounds : [
               
              ]
            };
            const newPostKey = push(
              child(ref(db), `sessions/${inputCode}/users`)
            ).key;
            const newUserKey =  push(
              child(ref(db), `users`)
            ).key;
            const addUser={}
           
           // console.log(`key ${newPostKey}`);
            const updates = {};
            updates[`sessions/${inputCode}/users/` + userID] = newUser;
              updates[`users/`+userID] = {[userID]:
              {
                name: playerName
              }};
              update(ref(db), updates);
            
             //window.location.href = `/lobby/${inputCode}`;
             navigate(`/lobby/${inputCode}`)

          } else {
            console.log("No data available");
            toast.error("Lobby doesnot exist");
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error(error);
        });
      console.log("enter game");
    }
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
          onChange={(e) => setInputCode(e.target.value)}
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
          onChange={(e) => setPlayerName(e.target.value)}
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
