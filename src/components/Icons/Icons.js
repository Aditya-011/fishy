import React from "react";
import "./Icons.css";
const Icons = ({ icon, title, clickHandler }) => {
  let isRules = title === "Rules" ? "rules" : "";
  let quit = title === "Quit" ? "quit" : "";
  let settings = title === "Settings" ? "settings" : "";
  let refresh = title === "Refresh" ? "refresh" : "";
  return (
    <button
      className={`icon-btn border-none ${isRules} ${quit} ${settings} ${refresh}`}
      onClick={clickHandler}
    >
      <img src={icon} title={title} alt={title} />
    </button>
  );
};

export default Icons;
