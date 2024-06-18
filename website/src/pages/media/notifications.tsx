import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/notifications.module.css";
import {useEffect, useState} from "react";
import { Knock } from "@knocklabs/node";
import {makeRequestWithToken} from "@/lib/api_tools";

interface NotificationProps {
    title: string,
    body: string
    image?: string
    clear: () => void
}

interface NotificationData {
    data: {
        title: string,
        body: string,
        image: string
    }
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

    const [notifications, setNotifications] = useState<NotificationData[]>([])
    const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_API_KEY_PUBLIC);


    useEffect(() => {


        fetchNotifications(knockClient).then((notifications) => {

            const notificationsResponse = notifications.items as any
            setNotifications(notificationsResponse)

            // Update them all to be seen
            const message_ids = notificationsResponse.map((notification: any) => notification.id)
            let urlIds = ""
            for (let i = 0; i < message_ids.length; i++) {
                urlIds += "&message_ids=" + message_ids[i]
            }

            // Send the request to update the status
            const response = makeRequestWithToken('post', '/api/user/notifications?operation=update_status' + urlIds)

        })


    }, []);

    const fetchNotifications = async (knockClient: Knock) => {
        const messages = await knockClient.users.getMessages("10");
        console.log(messages)
        return messages
    }

    const sendTest = async () => {

    }

    return(
        <Wrapper>
            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {
                        window.location.href = '/media'
                    }} className={styles.backButton}>
                        <img src={"/media/images/back.svg"} alt={"back"}/>
                    </button>

                    <h1>Notifications</h1>

                </div>


                {/* Notifications */}
                <div className={styles.notifications}>
                    {notifications.length === 0 && <h1>No notifications</h1>}
                    {notifications.map((notification, index) => {
                        {
                            return(
                                <Notification
                                    key={index}
                                    title={notification.data.title}
                                    body={notification.data.body}
                                    image={notification.data.image}
                                    clear={() => {
                                        setNotifications(notifications.filter((_, i) => i !== index))
                                    }}
                                />
                            )
                        }

                    })}
                </div>

                <button onClick={sendTest} className={styles.testButton}> Send Test Notification </button>
            </div>
        </Wrapper>
    )
}