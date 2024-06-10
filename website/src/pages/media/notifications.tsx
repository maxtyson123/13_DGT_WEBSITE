import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/notifications.module.css";

interface NotificationProps {
    title: string,
    body: string
    image?: string
    clear: () => void
}

export function Notification({title, body, image, clear}: NotificationProps){
    return(
        <div className={styles.notification}>
            <div className={styles.notificationIcon}>
                <img src={image ? image : "/media/images/notification.svg"} alt={"notification"}/>
            </div>
            <div className={styles.notificationText}>
                <h1>{title}</h1>
                <p>{body}</p>
            </div>
            <button onClick={clear} className={styles.clearButton}>
                <p> x </p>
            </button>
        </div>
    )
}

export default function Page(){

    const clear = () => {

    }

    return(
        <Wrapper>
            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {window.location.href = '/media'}} className={styles.backButton}>
                        <img src={"/media/images/back.svg"} alt={"back"}/>
                    </button>

                    <h1>Notifications</h1>

                </div>

                {/* Notifications */}
                <div className={styles.notifications}>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                    <Notification title={"test"} body={"Test2"} clear={() => {}}/>
                </div>
            </div>
        </Wrapper>
    )
}