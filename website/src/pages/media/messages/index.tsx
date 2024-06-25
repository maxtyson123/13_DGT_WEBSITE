import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/messages.module.css";
import {useEffect, useRef, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {useSession} from "next-auth/react";
import {RongoaUser} from "@/lib/users";
import {prop} from "remeda";
import {UserCard} from "@/pages/media/components/cards";
import {className} from "postcss-selector-parser";
import {Knock} from "@knocklabs/node";
import {MESSAGES_NOTIFICATIONS} from "@/lib/constants";


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

    // Added by the client
    user_name: string,
    user_photo: string,
    user_id: number
    unread: boolean
}


export function Conversation(props: ConversationData){

    const [message, setMessage] = useState<string>("")
    const [messageDate, setMessageDate] = useState<string>("")

    useEffect(() => {

        let messageString = props.message_text ? props.message_text : "Start the conversation..."
        let messageDate = props.message_date ? new Date(props.message_date).toLocaleString() : ""

        // Check if the user is the sender
        if(props.message_user_id !== props.user_id && messageString !== "Start the conversation..."){
            messageString = "You: " + messageString
        }

        // Check if the message is too long
        if(messageString.length > 30){
            messageString = messageString.substring(0, 30) + "..."
        }


        setMessage(messageString)
        setMessageDate(messageDate)


        setMessageDate(props.message_date ? new Date(props.message_date).toLocaleString() : "")
    }, [props])

    return(
        <>
            <div className={styles.message + ' ' + (props.unread ? styles.unread : "")} onClick={() => {
                window.location.href = '/media/messages/' + props.conversation_id
            }}>
                <div className={styles.messageIcon}>
                    <img src={props.user_photo} alt={"user"}/>
                </div>
                <div className={styles.messageText}>
                    <h1>{props.user_name}</h1>
                    <div className={styles.messageTextLine}>
                        <p>{message}</p>
                    </div>
                </div>
                <p className={styles.date}> {messageDate} </p>
            </div>
        </>
    )
}

export default function Page() {

    const {data: session} = useSession()
    const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_API_KEY_PUBLIC);

    const dataFetch = useRef(false)
    const [conversations, setConversations] = useState<ConversationData[]>([])
    const [newMessagePopup, setNewMessagePopup] = useState<boolean>(false)
    const [pageWidth, setPageWidth] = useState<number>(0)
    const [searchResults, setSearchResults] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {

        if(!session?.user) return

        if(!dataFetch.current){
            fetchMessages()
            dataFetch.current = true
        }

    }, [session])

    useEffect(() => {

        // Get the element with the .page class
        const page = document.querySelector(".pageWrapper")

        // Get the width of the page
        setPageWidth(page?.clientWidth as number)
    })

    const fetchMessages = async () => {

        // Show loading
        setLoading(true)


        // Get the notifications
        const messages = await knockClient.users.getMessages(
            (session?.user as RongoaUser)?.database.id.toString(),
            {
                source: MESSAGES_NOTIFICATIONS,
            }
        )
        const messagesResponse = messages.items as any
        console.log(messagesResponse)

        // Get the conversations
        const conversations = await makeRequestWithToken("get", "/api/user/conversations?operation=list")
        let data = conversations.data.data


        data = data.map((conversation: ConversationData) => {

            // Check if this is an unread message
            for(let i = 0; i < messagesResponse.length; i++){
                if(messagesResponse[i].seen_at === null
                && messagesResponse[i].data.message == conversation.message_text
                && messagesResponse[i].data.conversation_id == conversation.conversation_id)
                {
                    conversation.unread = true
                    break
                }else{
                    conversation.unread = false
                }
            }

            // Set the user name and photo to not the current user
            if(conversation.conversation_user_one !== (session?.user as RongoaUser).database.id){
                conversation.user_name = conversation.user_one_name
                conversation.user_photo = conversation.user_one_photo
                conversation.user_id = conversation.conversation_user_one
            }else{
                conversation.user_name = conversation.user_two_name
                conversation.user_photo = conversation.user_two_photo
                conversation.user_id = conversation.conversation_user_two
            }
            return conversation
        })

        // Sort the conversations by the most recent message
        data.sort((a: ConversationData, b: ConversationData) => {
            if(a.message_date && b.message_date){
                return new Date(b.message_date).getTime() - new Date(a.message_date).getTime()
            }else{
                return 0
            }
        })

        setConversations(data)
        console.log(conversations.data.data)
        setLoading(false)

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

    const searchNewConvo = async () => {

        const search = document.querySelector("." + styles.newMessagePopup + " input") as HTMLInputElement
        let query = ""
        if(search != null) {
            query = search.value
        }

        const results = await makeRequestWithToken("get", `/api/user/follow?operation=listMutual${query ? `&search=${query}` : ""}`)

        const ids = results.data.data.map((result: any) => {
            return result.following_id
        })

        setSearchResults(ids)
    }


    const showNewMessagePopup = () => {

        // Reset the search results
        setSearchResults([])

        // Show the popup
        searchNewConvo()
        setNewMessagePopup(true)
    }

    return(
        <Wrapper>
            <div className={styles.page}>

                {/* New Message Popup */}
                {
                    newMessagePopup &&
                    <div className={styles.newMessagePopup} style={{width: pageWidth}}>
                        <div className={styles.newMessagePopupContent}>

                            {/* Top Info */}
                            <h1>Send a new message</h1>
                            <p>Note: you have to be following each other to send messages.</p>

                            {/*Search Input*/}
                            <input type={"text"} placeholder={"Search user name"}/>
                            <button onClick={searchNewConvo}>Search</button>

                            {/*Results*/}
                            <div className={styles.newMessagePopupResults}>
                                <h1>Results</h1>

                                {/* No Results */}
                                {searchResults.length === 0 && <p>No Results</p>}

                                {/* Results */}
                                {searchResults.map((id, index) => {
                                    return (
                                        <div key={index} className={styles.newMessagePopupResult} onClick={() => {createConverSation(id.toString())}}>
                                            <UserCard id={id}/>
                                        </div>
                                )
                                })}

                            </div>

                            {/*Close*/}
                            <button onClick={() => {
                                setNewMessagePopup(false)
                            }}>Close
                            </button>
                        </div>
                    </div>
                }

                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {window.location.href = '/media'}} className={styles.backButton}>
                        <img src={"/media/images/back.svg"} alt={"back"}/>
                    </button>

                    <h1>Messages</h1>

                </div>


              <div className={styles.messageContentsContainer}>

                {/* New Message */}
               <button className={styles.newMessage} onClick={showNewMessagePopup}>New Message</button>


              { loading && <p className={styles.loading}>Loading...</p> }

                {/* Conversations */}
                {
                    conversations.length === 0 && !loading ? <h1>No Messages</h1> :
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
            </div>

        </Wrapper>
    )
}