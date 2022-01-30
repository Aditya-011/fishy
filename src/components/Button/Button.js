import React from 'react'
import './Button.css'

const Button = ({clickHandler, text, display}) => {
    if(clickHandler){
    return (
            <button onClick = {(e) => clickHandler(e)} className={`super-btn ${display} btn-lg inline-block bg-center`}>
                {text}
            </button>
    )
    }
    return (
        <button  className={`super-btn ${display} btn-lg inline-block bg-center`}>
            {text}
        </button>
    )
}

export default Button
