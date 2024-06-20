import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/messages.module.css";
import {useEffect, useRef, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {RongoaUser} from "@/lib/users";
import {useSession} from "next-auth/react";

interface MessageBubbleProps {
    message: string,
    type: "sent" | "received"
    date?: string
}
export function MessageBubble(props: MessageBubbleProps){
    return(
        <>
            {props.type === "sent" ? <div className={styles.spacer}></div> : null}
            <div className={styles.messageBubble + " " + (props.type === "sent" ? styles.sent : styles.received)}>
                <p>{props.message}</p>
            </div>
            {props.type === "received" ? <div className={styles.spacer}></div> : null}
        </>

    )
}

interface MessageData {
    id: number,
    message_conversation_id: number,
    message_date: string,
    message_text: string,
    message_user_id: number,
    user_one_image: string,
    user_one_name: string,
    user_two_image: string,
    user_two_name: string
}

export default function Page(){

    const [messages, setMessages] = useState<any[]>([]);
    const [noMessages, setNoMessages] = useState<boolean>(true)
    const [recpientName, setRecipientName] = useState<string>("")
    const [recipientImage, setRecipientImage] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)

    const {data: session} = useSession();

    const newMessage = async () => {

        // get the message
        const message = (document.getElementById("message") as HTMLInputElement).value;

        // Update the messages
        setLoading(true)
        const send = await makeRequestWithToken("get", "/api/user/conversations/?operation=update&message=" + message + "&channelID=" + window.location.pathname.split("/")[3]);

        // Reset the message
        (document.getElementById("message") as HTMLInputElement).value = "";

        // Update the page
        fetchMessages();

    }

    // Fetching data
    const dataFetch = useRef(false);

    useEffect(() => {

        // Check if the user is logged in
        if(!session?.user) return;

        // Only run once
        if(dataFetch.current) return;
        dataFetch.current = true;

        // Fetch the data
        fetchMessages();


    }, [session]);

    const fetchMessages = async () => {

        // Set the loading state
        setLoading(true);

        // Get the conversation ID
        const conversationID = window.location.pathname.split("/")[3];

        // Make the request
        const data = await makeRequestWithToken("get", "/api/user/conversations/?operation=get&channelID=" + conversationID);
        const apiMessages = data.data.data;

        // If the array is empty, return
        if(apiMessages.length === 0){
            window.location.href = "/media/messages";
            return;
        }

        const firstMessage = apiMessages[0];
        console.log(apiMessages)

        // Set the recipient name and image
        if(firstMessage.user_one_name !== (session?.user as RongoaUser).database.user_name)
        {
            setRecipientName(firstMessage.user_one_name);
            setRecipientImage(firstMessage.user_one_image);
        } else{
            setRecipientName(firstMessage.user_two_name);
            setRecipientImage(firstMessage.user_two_image);
        }

        // Check if the first message is null
        setNoMessages(firstMessage.message_text === null);

        // Set the messages
        setMessages(apiMessages);
        setLoading(false);

    }


    useEffect(() => {
        scrollMessages();
    }, [messages]);

    const scrollMessages = () => {

        // Scroll to the bottom of the messages
        const messages = document.getElementById("messages");

        if(messages){
            messages.scrollTop = messages.scrollHeight;
        }

    }

    return(
        <Wrapper>
            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {window.location.href = '/media/messages'}} className={styles.backButton}>
                        <img src={"/media/images/back.svg"} alt={"back"}/>
                    </button>

                    <h1>{recpientName}</h1>

                </div>

                {/* Messages */}
                <div className={styles.messages} id = {"messages"}>
                    {noMessages ?
                        <div className={styles.noMessages}>
                            <p>No Messages</p>
                        </div>
                    :
                        <>
                            {messages.map((message: MessageData, index) => {
                                return(
                                    <>
                                        <MessageBubble
                                            key={index}
                                            message={message.message_text}
                                            type={message.message_user_id === (session?.user as RongoaUser).database.id ? "sent" : "received"}
                                        />
                                    </>

                                )
                            })}
                        </>
                    }
                    {
                        loading &&
                        <div className={styles.loading}>
                            <p>Loading...</p>
                        </div>
                    }

                </div>

                {/* New Message */}
                <div className={styles.newMessage}>
                   <input id={"message"} placeholder="Type a message..."/>
                   <button onClick={newMessage}>Send</button>
                </div>

            </div>

        </Wrapper>
    )
}