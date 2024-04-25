import {useRouter} from "next/router";
import {AccountPage} from "@/pages/account/index";
import {useEffect, useState} from "react";
import {Error} from "@/components/error";
import {useSession} from "next-auth/react";

export default function AccountViewer(){

    const router = useRouter()


    const[userID, setUserID] = useState<any>(null)

    const [error, setError] = useState("")
    const { data: session } = useSession()

    // Check the id
    useEffect(() => {
        let { id } = router.query
        setUserID(id)

    }, [router.query]);



    return(
        <>
            { error ? <Error error={error}/> : <AccountPage dataID={userID}/> }

        </>
    )

}