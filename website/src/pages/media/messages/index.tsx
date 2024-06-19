import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/messages.module.css";
import {useEffect, useRef, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {useSession} from "next-auth/react";
import {RongoaUser} from "@/lib/users";
import {prop} from "remeda";


export interface ConversationData {
    conversation_id: number,
    conversation_user_two: number,
    conversation_user_one: number,
    message_id?: number,
    message_user_id?: number,
    message_text?: string,
    message_date?: string
    user_one_name: string,
    user_two_name: string,
    user_one_photo: string,
    user_two_photo: string,
    user_name: string,
    user_photo: string,
}


export function Conversation(props: ConversationData){
    return(
        <>
            <div className={styles.message} onClick={() => {window.location.href = '/media/messages/' + props.conversation_id}}>
                <div className={styles.messageIcon}>
                    <img src={props.user_photo} alt={"user"}/>
                </div>
                <div className={styles.messageText}>
                    <h1>{props.user_name}</h1>
                    <div className={styles.messageTextLine}>
                        <p>{props.message_text ? props.message_text : "Start the conversation..."}</p>
                        <p className={styles.date}> {props.message_date && props.message_date} </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function Page(){

    const {data: session} = useSession()

    const dataFetch = useRef(false)
    const [conversations, setConversations] = useState<ConversationData[]>([])

    useEffect(() => {

        if(!session?.user) return

        if(!dataFetch.current){
            fetchMessages()
            dataFetch.current = true
        }

    }, [session])

    const fetchMessages = async () => {

        const conversations = await makeRequestWithToken("get", "/api/user/conversations?operation=list")
        let data = conversations.data.data

        // Set the user name and photo to not the current user
        data = data.map((conversation: ConversationData) => {
            if(conversation.conversation_user_one !== (session?.user as RongoaUser).database.id){
                conversation.user_name = conversation.user_one_name
                conversation.user_photo = conversation.user_one_photo
            }else{
                conversation.user_name = conversation.user_two_name
                conversation.user_photo = conversation.user_two_photo
            }
            return conversation
        })


        setConversations(data)
        console.log(conversations.data.data)

    }

    const createConverSation = async (id: string) => {

        // Check if the user id already has a conversation
        for(let i = 0; i < conversations.length; i++){
            if(conversations[i].conversation_user_two === parseInt(id) || conversations[i].conversation_user_one === parseInt(id)){
                window.location.href = '/media/messages/' + conversations[i].conversation_id
                return
            }
        }

        const newConversation = await makeRequestWithToken("get", "/api/user/conversations?operation=new&recipientID=" + id)
        window.location.reload()
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
                   <button onClick={() => {createConverSation("11")}}>New Message</button>
                </div>

                {/* Conversations */}
                {
                    conversations.length === 0 ? <h1>No Messages</h1> :
                    conversations.map((conversation: ConversationData, index) => {
                        return(
                            <Conversation
                                key={index}
                                {...conversation}
                            />
                        )
                    })

                }
            </div>

        </Wrapper>
    )
}