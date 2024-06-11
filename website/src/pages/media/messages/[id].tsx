import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/messages.module.css";
import {useEffect, useState} from "react";

interface MessageBubbleProps {
    message: string,
    type: "sent" | "received"
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

export default function Page(){

    const [messages, setMessages] = useState<any[]>([]);

    const newMessage = () => {

        // get the message
        const message = (document.getElementById("message") as HTMLInputElement).value;


        setMessages([...messages, {message: message, type: "sent"}])

    }

    useEffect(() => {
        scrollMessages();
    }, [messages]);

    const scrollMessages = () => {

        // Scroll to the bottom of the messages
        const messages = document.getElementById("messages");
        console.log(messages)

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

                    <h1>USERNAME</h1>

                </div>

                {/* Messages */}
                <div className={styles.messages} id = {"messages"}>
                    {messages.length === 0 ? <div className={styles.noMessages}>
                        <p>No Messages</p>
                    </div> : null}

                    {messages.map((message, index) => {
                        return(
                            <MessageBubble message={message.message} type={message.type} key={index}/>
                        )
                    })}
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