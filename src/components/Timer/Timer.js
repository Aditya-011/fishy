import React from 'react'
import './Timer.css'

const Timer = ({time, completed}) => {
    return (
    <div className="flex flex-col justify-center items-center">
      <div className="wrapper">
        <div style={{ width: `${completed}%` }} className="timer"></div>
      </div>
      <p className="text">{time}</p>
    </div>
    )
}

export default Timer
