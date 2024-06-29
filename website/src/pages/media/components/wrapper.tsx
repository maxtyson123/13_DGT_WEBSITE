import {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {RongoaUser} from "@/lib/users";
import {KnockProvider} from "@knocklabs/react";
import {useRouter} from "next/router";
import { setTimeout } from "timers/promises";

interface WrapperProps{
    children: React.ReactNode;
    login?: boolean;
}

export default function Wrapper({children, login}: WrapperProps){
    const router = useRouter();

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
            router.push("/media/login")
        }

    }, [session, reCheck.current, login])

    return(
        <>

                <KnockProvider
                    apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY ? process.env.NEXT_PUBLIC_KNOCK_API_KEY : ""}
                    userId={(session?.user as RongoaUser)?.database.id.toString()}
                >
                    {/* Show the page */}
                    <div className={"pageWrapper"}>
                        <div className={"content slide-in-right"}>
                            {children}
                        </div>
                    </div>
                </KnockProvider>

        </>
    )
}
