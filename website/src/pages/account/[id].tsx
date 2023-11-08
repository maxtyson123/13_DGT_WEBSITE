import {useRouter} from "next/router";
import {AccountPage} from "@/pages/account/index";
import {useEffect, useRef, useState} from "react";

export default function AccountViewer(){

    const router = useRouter()


    const[userID, setUserID] = useState<any>(null)

    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)


    // Check the id
    useEffect(() => {
        let { id } = router.query
        setUserID(id)

    }, [router.query]);

    return(
        <>
            {userID && <AccountPage dataID={userID}/>}
        </>
    )

}