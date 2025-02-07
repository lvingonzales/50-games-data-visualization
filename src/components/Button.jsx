import PropTypes from "prop-types";
import style_button from "../styles/style_button.module.css"
import { useEffect, useRef } from "react";

export default function Button ({callback, text, uniqClass}) {
    const buttonRef = useRef(null)
    useEffect(() => {
        uniqClass ? buttonRef.current.classList.add(uniqClass) : null
    }, []);

    return <button ref={buttonRef} onClick={callback} className={style_button.btn}>{text}</button>
}

Button.propTypes = {
    callback: PropTypes.func,
    text: PropTypes.string,
    uniqClass: PropTypes.string
}
