import {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";

interface WrapperProps{
    children: React.ReactNode;
    login?: boolean;
}

export default function Wrapper({children, login}: WrapperProps){


    const { data: session } = useSession();
    const reCheck = useRef(false);

    // If this is not the login page redirect to the login page if the user is not logged in
    useEffect(() => {
        if(login)
            return

        // Check if session is undefined
        if(session === undefined) {
            return
        }
        // If the user is not logged in then redirect to the login page
        if(!session?.user){
            window.location.href = "/media/login"
        }

    }, [session, reCheck.current, login])

    return(
        <>
            {/* Show the page */}
            <div className={"pageWrapper"}>
                <div className={"content"}>
                    {children}
                </div>
            </div>
        </>
    )
}