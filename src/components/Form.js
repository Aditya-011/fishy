import React from 'react'
import Heading from './Heading'
const Form = ({code}) => {
    return (
        <form className = "flex flex-row justify-center items-center w-full">
            <div className ="">
            <Heading display = {`md:text-2xl m-8 xs-mobile:text-lg`} text = {`Your Invitation:`} />
            </div>
            <div className = '  '>
            <textarea
            defaultValue = {code}
            className='border-solid text-2xl text-center border-gray-400 border-2 h-20 w-75 resize-none flex-1'>
            </textarea>
            </div>
      </form>
    )
}

export default Form
