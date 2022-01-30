import React from 'react'
import './FishOptions.css'

const FishOptions = ({fishes, active, SelectChoice, id}) => {
    if(SelectChoice){
        return (
            <div className = {active?`box active cursor-pointer` : `box cursor-pointer`} onClickCapture = {() => SelectChoice(id)}>
                <img src = {fishes} alt = "fishes" className = "h-5/6"></img>
            </div>
        )
    }
    return (
        <div className = {active?`box active` : `box`}>
            <img src = {fishes} alt = "fishes" className = "h-5/6"></img>
        </div>
    )
}

export default FishOptions
