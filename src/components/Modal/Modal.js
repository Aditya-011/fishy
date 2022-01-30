import React from 'react'

const Modal = (props) => {
    return (
        
        <div className={`md:min-w-5/6 xs-mobile:min-w-full h-full animated fadeIn faster fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none overflow-y-auto`}>
            <div className='absolute bg-black opacity-80 inset-0 z-0'></div>
            <div className = 'bg-no-repeat bg-cover bg-center  bg-fishy-background p-2 relative h-auto md:max-h-5/6 xs-mobile:h-3/6 mx-auto my-auto shadow-lg max-w-4xl bg-white rounded-xl overflow-y-auto'>
                {props.children}
            </div>
        </div>
    )
}

export default Modal
