import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/messages.module.css";

export function Message(){
    return(
        <>
            <div className={styles.message} onClick={() => {window.location.href = '/media/messages/1'}}>
                <div className={styles.messageIcon}>
                    <img src={"/media/images/user.svg"} alt={"user"}/>
                </div>
                <div className={styles.messageText}>
                    <h1>User Name</h1>
                    <p>User Message.......</p>
                </div>
            </div>
        </>
    )
}

export default function Page(){

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
                   <button>New Message</button>
                </div>

                {/* Messages */}
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>

            </div>

        </Wrapper>
    )
}