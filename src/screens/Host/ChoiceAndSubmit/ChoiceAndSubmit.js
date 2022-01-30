import React from "react";
import Fish1 from "../../../images/Fish1-new.png";
import Fish2 from "../../../images/Fish2-new.png";
import "../ShowOptions/ShowOptions.css";

const ChoiceAndSubmit = ({
  toggle,
  choice,
  submitHostChoice,
  time,
  paused,
}) => {
  // const [event, setEvent] = useState(false);
  console.log(paused);
  let classStyle = "";
  if (toggle > 0) {
    if (toggle < 2) {
      classStyle = "toggle-one";
    } else {
      classStyle = "toggle-two";
    }
  } else if (choice > 0) {
    if (choice < 2) {
      classStyle = "one";
    } else {
      classStyle = "two";
    }
  }

  // useEffect(() => {
  //   if(time === 0 || (time !== 0 && paused)){
  //     set
  //   }
  // },[time, paused])

  return (
    <div className={`flex flex-col box ${classStyle}`}>
      <div
        onClick={() => submitHostChoice(1)}
        className={`w-full flex justify-center items-center mb-2 
        ${time === 0 || (time !== 0 && paused) ? `` : `pointer-events-none`}
        `}
      >
        <img
          src={Fish1}
          alt="fishes"
          style={{ width: "33%" }}
          className="h-5/6 object-contain"
        ></img>
      </div>
      <div
        onClick={() => submitHostChoice(2)}
        className={`w-full flex justify-center
        ${time === 0 || (time !== 0 && paused) ? `` : `pointer-events-none`}
        `}
      >
        <img
          src={Fish2}
          alt="fishes"
          style={{ width: "55%" }}
          className="h-5/6 object-contain"
        ></img>
      </div>
    </div>
  );
  //   if (toggle > 0) {
  //     return (
  //       <div className={toggle < 2 ? "box toggle-one" : "box toggle-two"}>
  //         <img src={fishes} alt="fishes" className="h-5/6"></img>
  //         <img src={fishes} alt="fishes" className="h-5/6"></img>
  //       </div>
  //     );
  //   } else if (choice > 0) {
  //     return (
  //       <div className={choice < 2 ? "box one" : "box two"}>
  //         <img src={fishes} alt="fishes" className="h-5/6"></img>
  //         <img src={fishes} alt="fishes" className="h-5/6"></img>
  //       </div>
  //     );
  //   } else if (!fishes) {
  //     return <div className={"box"}></div>;
  //   }
  //   return (
  //     <div className={"box"}>
  //       <img src={fishes} alt="fishes" className="h-5/6"></img>
  //       <img src={fishes} alt="fishes" className="h-5/6"></img>
  //     </div>
  //   );
};

export default ChoiceAndSubmit;
