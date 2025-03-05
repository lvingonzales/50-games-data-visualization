import PropTypes from "prop-types";
import style_button from "../styles/style_button.module.css"
import { useEffect, useRef, useState } from "react";

export default function Button ({callback, text, activeChart = null, associatedChart = null, activeCriteria = null, associatedCriteria = null}) {
    const [isActive, setIsActive] = useState(true)
    const buttonRef = useRef(null);

    useEffect(() => {
        activeChart === associatedChart ? setIsActive(true) : setIsActive(false);
        if(associatedCriteria !== null) {
            activeCriteria === associatedCriteria ? setIsActive(true) : setIsActive(false);
        }
    }, [activeChart, activeCriteria, associatedChart, associatedCriteria]);

    return <button ref={buttonRef} onClick={callback} className={`${style_button.btn} ${isActive ? style_button.inactive: null}`}>{text}</button>
}

Button.propTypes = {
    callback: PropTypes.func,
    text: PropTypes.string,
    activeChart: PropTypes.string,
    associatedChart: PropTypes.string,
    activeCriteria: PropTypes.string,
    associatedCriteria: PropTypes.string
}
