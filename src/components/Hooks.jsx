import { useEffect, useRef, useState } from "react";

 export function useElementOnScreen (options) {
    const objectRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const callBackFunction = (entries) => {
            const [entry] = entries;
            setIsVisible(entry.isIntersecting);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(callBackFunction, options);
        if (objectRef.current) observer.observe(objectRef.current);

        return () => {
            if (objectRef.current) observer.unobserve(objectRef.current);
        }
    }, [objectRef, options])

    return [objectRef, isVisible]
}
