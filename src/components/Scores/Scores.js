import React, { useEffect } from "react";
import "./Scores.css";

const Scores = ({ show, scores, players }) => {
  useEffect(() => {
    const ele = document.querySelector(".active");
    if (ele) {
      ele.scrollIntoView();
    }
  });

  let total = [0, 0, 0, 0];
  let rowScore = 0;
  return (
    <ul className="scores">
      <li className={`titles grid-display ${show}`}>
        <p className="grid-display-item">Round</p>
        {players.map((player, index) => {
          return (
            <p key={index} className="grid-display-item">
              {player.name}
            </p>
          );
        })}
        {show ? <p className="grid-display-item display">Round Total</p> : null}
      </li>
      {scores && scores.map((score, index) => {
        let row = 0;
        if (index === scores.length - 1) {
          return (
            <li key={index + 20} className={`grid-display active ${show}`}>
              {index === 4 ? (
                <p className="grid-display-item xl:ml-12 lg:ml-10">
                  {`#${index + 1}`}
                  <span className="multiplier">X3</span>
                </p>
              ) : index === 7 ? (
                <p className="grid-display-item xl:ml-12 lg:ml-10">
                  {`#${index + 1}`}
                  <span className="multiplier">X5</span>
                </p>
              ) : index === 9 ? (
                <p className="grid-display-item xl:ml-12 lg:ml-10">
                  {`#${index + 1}`}
                  <span className="multiplier">X10</span>
                </p>
              ) : (
                <p className="grid-display-item">{`#${index + 1}`}</p>
              )}
              {score && score.map((indivScore, ind) => {
                total[ind] += indivScore;
                row += indivScore;
                rowScore += indivScore;
                return (
                  <p key={`${index}`} className="grid-display-item">
                    {indivScore}
                  </p>
                );
              })}
              {show === true ? (
                <p className="grid-display-item display">{row}</p>
              ) : null}
            </li>
          );
        }
        return (
          <li key={`${index + 1}`} className={`grid-display ${show}`}>
            {index === 4 ? (
              <p className="grid-display-item xl:ml-12 lg:ml-10">
                {`#${index + 1}`}
                <span className="multiplier">X3</span>
              </p>
            ) : index === 7 ? (
              <p className="grid-display-item xl:ml-12 lg:ml-10">
                {`#${index + 1}`}
                <span className="multiplier">X5</span>
              </p>
            ) : index === 9 ? (
              <p className="grid-display-item xl:ml-12 lg:ml-10">
                {`#${index + 1}`}
                <span className="multiplier">X10</span>
              </p>
            ) : (
              <p className="grid-display-item">{`#${index + 1}`}</p>
            )}
            {score && score.map((indivScore, ind) => {
              total[ind] += indivScore;
              row += indivScore;
              rowScore += indivScore;
              return (
                <p key={`${index + 1}.${ind}`} className="grid-display-item">
                  {indivScore}
                </p>
              );
            })}
            {show === true ? (
              <p className="grid-display-item display">{row}</p>
            ) : null}
          </li>
        );
      })}
      <li className={`grid-display total ${show}`}>
        <p className="grid-display-item">Total</p>

        {total.map((score, ind) => {
          return (
            <p key={`${ind}`} className="grid-display-item">
              {score}
            </p>
          );
        })}
        {show ? (
          <p className="grid-display-item row-total display">{rowScore}</p>
        ) : null}
      </li>
    </ul>
  );
};

export default Scores;
