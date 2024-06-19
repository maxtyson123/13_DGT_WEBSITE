import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/messages.module.css";
import {useEffect, useRef, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {useSession} from "next-auth/react";
import {RongoaUser} from "@/lib/users";

export function Conversation(){
    return(
        <>
            <div className={styles.message} onClick={() => {window.location.href = '/media/messages/1'}}>
                <div className={styles.messageIcon}>
                    <img src={"/media/images/user.svg"} alt={"user"}/>
                </div>
                <div className={styles.messageText}>
                    <h1>User Name</h1>
                    <div className={styles.messageTextLine}>
                        <p>User Message.......</p>
                        <p className={styles.date}> Date </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export interface ConversationData {
    id: number,
    conversation_user_two: number,
    conversation_user_one: number,
    message_id?: number,
    message_user_id?: number,
    message_text?: string,
    message_date?: string
}

export default function Page(){

    const {data: session} = useSession()

    const dataFetch = useRef(false)
    const [conversations, setConversations] = useState<ConversationData[]>([])

    useEffect(() => {

        if(!dataFetch.current){
            fetchMessages()
            dataFetch.current = true
        }

    }, [])

    const fetchMessages = async () => {

        const conversations = await makeRequestWithToken("get", "/api/user/conversations?operation=list")
        setConversations(conversations.data.data)

    }

    const createTestConversation = async () => {

        const newConversation = await makeRequestWithToken("get", "/api/user/conversations?operation=new&recipientID=11")

        setConversations([...conversations, {
            id: newConversation.data.data.id,
            conversation_user_one: (session?.user as RongoaUser).database.id,
            conversation_user_two: 11

        }])


    }


    return(
        <Wrapper>
            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {window.location.href = '/media'}} className={styles.backButton}>
                        <img src={"/media/images/back.svg"} alt={"back"}/>
                    </button>

                    <h1>Messages</h1>

                </div>

                {/* New Message */}
                <div className={styles.newMessage}>
                   <button onClick={createTestConversation}>New Message</button>
                </div>

                {/* Conversations */}
                {
                    conversations.length === 0 ? <h1>No Messages</h1> :
                    conversations.map((conversation: ConversationData, index) => {
                        return(
                            <Conversation key={index}/>
                        )
                    })

                }
            </div>

        </Wrapper>
    )
}