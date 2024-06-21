import Wrapper from "@/pages/media/components/wrapper";
import styles from "@/styles/media/notifications.module.css";
import {useEffect, useRef, useState} from "react";
import { Knock } from "@knocklabs/node";
import {makeRequestWithToken} from "@/lib/api_tools";
import { useSession } from "next-auth/react";
import {RongoaUser} from "@/lib/users";

interface NotificationProps {
    title: string,
    body: string
    image?: string
    seen?: string
    clear: () => void
}

interface NotificationData {
    id: string,
    seen_at: string,
    read_at: string,
    data: {
        title: string,
        body: string,
        image: string
    }
}

export function Notification({title, body, image, clear, seen}: NotificationProps){

    return(
        <div className={styles.notification + " " + (seen ? styles.seen : "")}>
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
    const [loading, setLoading] = useState(true)
    const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_API_KEY_PUBLIC);
    const {data: session} = useSession();

    const dataFetch = useRef(false);

    useEffect(() => {

        // Make sure the user is logged in
        if(!session?.user)
            return

        // Check if data has been fetched
        if(dataFetch.current)
            return

        setLoading(true)
        dataFetch.current = true
        fetchNotifications(knockClient).then((notifications) => {

            setLoading(false)

            const notificationsResponse = notifications.items as any
            setNotifications(notificationsResponse)

            // Update them all to be seen
            const message_ids = notificationsResponse.map((notification: any) => notification.id)
            let urlIds = ""
            for (let i = 0; i < message_ids.length; i++) {
                urlIds += "&message_ids=" + message_ids[i]
            }

            // Send the request to update the status
            const response = makeRequestWithToken('post', '/api/user/notifications?operation=update_status' + urlIds + "&status=seen")

        })


    }, [session]);

    const fetchNotifications = async (knockClient: Knock) => {
        console.log("Fetching notifications ",  (session?.user as RongoaUser)?.database.id.toString())
        const messages = await knockClient.users.getMessages(
            (session?.user as RongoaUser)?.database.id.toString(),
            {
                source: "test",
            }
        );

        console.log(messages)
        return messages
    }

    const clear = async (id: string) => {

        // Send the request to update the status
        const response = makeRequestWithToken('post', '/api/user/notifications?operation=update_status' + "&message_ids=" + id + "&status=read")


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


                    {/*Show that there are no notifications if there are none or if its loading */}
                    <div className={styles.noNotifications}>
                    {
                        loading ?

                            <img src={"/media/images/small_loading.gif"} height={65} width={65} alt={"loading"}/>

                            :

                            <>
                                {notifications.length === 0 && <h1>No Notifications :(</h1>}
                            </>
                    }
                    </div>


                    {/*Show the notifications that havent been read*/}
                    {notifications.map((notification, index) => {
                        {
                            return(
                                <>
                                    {
                                        notification.read_at === null && <Notification
                                            key={index}
                                            seen={notification.seen_at}
                                            title={notification.data.title}
                                            body={notification.data.body}
                                            image={notification.data.image}
                                            clear={() => {
                                                clear(notification.id)
                                                setNotifications(notifications.filter((value) => value.id !== notification.id))
                                            }}
                                        />
                                    }
                                </>
                            )
                        }
                    })}
                </div>

            </div>
        </Wrapper>
    )
}