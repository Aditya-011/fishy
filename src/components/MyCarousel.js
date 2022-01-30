import Carousel  from 'react-bootstrap/Carousel'
import React from 'react'
import rules_1 from "../images/rules-1.png";
import rules_2 from "../images/rules-2.png";
import rules_3 from "../images/rules-3.png";
import rules_4 from "../images/rules_guide.png";
import rules_5 from "../images/rules-5.png";
import Heading from './Heading';

const MyCarousel = ({showRules}) => {
    const images = [rules_1, rules_2, rules_3, rules_4, rules_5]
    return (
        <div className='flex flex-col w-full h-full'>
            <div className = "inline-flex justify-end">
                <div className = "ml-auto mr-auto inline-block">
                <Heading text = {'Rules'} display = {'md:text-2xl xs-mobile:text-lg text-warning'} />
                </div>
                <div className = "inline-block">
                <button onClick = {() => showRules(false)} className="text-light text-2xl hover:text-light">
                        &times;
                </button>
                </div>
            </div>
            <Carousel>
                {images.map((i, index) => {
                    return(
                        <Carousel.Item key = {index} interval={10000} className = "xs-mobile:h-96 md:h-3/5">
                            <img
                            className="w-full md:h-auto"
                            src={i}
                            alt={`${index} slide`}
                            />
                        </Carousel.Item>    
                    )
                })}
                </Carousel>
            </div>

    )
}

export default MyCarousel
