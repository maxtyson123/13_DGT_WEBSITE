import {useEffect, useRef} from "react";

export default function Analytics(){

    const doOnce = useRef(false);

    useEffect(() => {

        // If already fetched, don't fetch again
        if(doOnce.current) return;



    }, []);
}