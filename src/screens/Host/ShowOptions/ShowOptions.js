import React from 'react'
import './ShowOptions.css'

const ShowOptions = ({fishes, toggle, choice}) => {
    if(toggle > 0){
        return(
            <div className = {toggle < 2? 'box toggle-one' : 'box toggle-two'}>
                <img src = {fishes} alt = "fishes" className = "h-5/6"></img>
            </div>
        )
    }
    
    else if(choice > 0){
        return(
            <div className = {choice < 2? 'box one' : 'box two'}>
                <img src = {fishes} alt = "fishes" className = "h-5/6"></img>
            </div>
        )
    }
    else if(!fishes){
        return (
            <div className = {'box'}>
            </div>
    )
    }
    return (
        <div className = {'box'}>
            <img src = {fishes} alt = "fishes" className = "h-5/6"></img>
        </div>
    )
}

export default ShowOptions
