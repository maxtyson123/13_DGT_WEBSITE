import Wrapper from "@/pages/media/components/wrapper";
import stlyes from '@/styles/media/main.module.css'
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {InfiniteLoading} from "@/components/infinteLoading";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {RongoaUser} from "@/lib/users";
import {Knock} from "@knocklabs/node";

export default function Home(){

    const dataFetch = useRef(false);
    const queryClient = new QueryClient()
    const router = useRouter()
    const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_API_KEY_PUBLIC);

    // Loading
    const [storiesLoading, setStorysLoading] = useState(true);

    // Data
    const [stories, setStories] = useState([]);
    const [following, setFollowing] = useState("");
    const [id, setId] = useState(0);
    const [notifications, setNotifications] = useState(0);

    const {data: session} = useSession();


    // Get the user id
    useEffect(() => {


        //Check if the user is logged in
        if(!session?.user) return;


        // Get the user id
        setId((session.user as RongoaUser).database.id);

        // If the user has  not logged in, return

        if(dataFetch.current) return;

        dataFetch.current = true;

        // Fetch data here
        fetchData();

    }, [session]);

    const fetchData = async () => {

        // Fetch who the user is following
        const following = await makeRequestWithToken("get", "/api/user/follow?operation=listFollowing")

        // No stories
        if(following.data.data.length === 0) {
            setStorysLoading(false);
            setFollowing("none")
            return
        }

        const followingData = following.data.data.map((item: any) => item.following_id);


        // Make the string of the following
        const followingString = followingData.join("&following=");
        setFollowing(followingString);

        // Fetch the  stories
        // todo

        // Get the notifications
        const messages = await knockClient.users.getMessages((session?.user as RongoaUser)?.database.id.toString())
        const notificationsResponse = messages.items as any
        let unseen = 0;
        for (let i = 0; i < notificationsResponse.length; i++) {
            if(notificationsResponse[i].seen_at === null)
                unseen++;
        }

        // Max of 99 notifications
        if(unseen > 99)
            unseen = 99;

        setNotifications(unseen)

    };

    return(
        <Wrapper>
            <div className={stlyes.page}>

                {/* Top Bar */}
                <div className={stlyes.topBar}>

                    <div className={stlyes.logo}>
                        <img src="/media/images/logo.svg" alt="Rongoa Logo"/>
                        <div className={stlyes.topText}>
                            <h1>Rongoa</h1>
                            <h2>Media</h2>
                        </div>

                    </div>

                    <button className={stlyes.message} onClick={() => {router.push("/media/messages")}}>
                        <img src="/media/images/message.svg" alt="Messages"/>
                        <p>0</p>
                    </button>

                </div>



                {/* Posts */}
                <div className={stlyes.posts}>

                    {/* Stories */}
                    <div className={stlyes.stories}>
                        <div className={stlyes.story}>
                            <img src="/media/images/logo.svg" alt="Logo"/>
                            <div>
                                <img src="/media/images/Add.svg" alt="Plus"/>
                            </div>
                            <p>My Story</p>
                        </div>

                        {
                            storiesLoading ?
                                <>
                                    <div className={stlyes.story}>
                                        <img src="/media/images/small_loading.gif" style={{border: "0px"}} alt="Logo"/>
                                    </div>
                                    <div className={stlyes.story}>
                                        <p>Loading Stories...</p>
                                    </div>
                                </>
                            :
                                <>
                                    <div className={stlyes.story + " " + stlyes.active}>
                                        <img src="/media/images/logo.svg" alt="Logo"/>
                                        <p>Username</p>
                                    </div>
                                    <div className={stlyes.story}>
                                        <img src="/media/images/logo.svg" alt="Logo"/>
                                        <p>Username</p>
                                    </div>
                                    <div className={stlyes.story}>
                                        <img src="/media/images/logo.svg" alt="Logo"/>
                                        <p>Username</p>
                                    </div>
                                </>
                        }

                    </div>

                    <div className={stlyes.postsContianer}>
                    { following && session?.user &&
                        <QueryClientProvider client={queryClient}>
                            <InfiniteLoading searchQuery={`/api/posts/fetch?operation=generalFeed&following=${following}&id=${id}`} display={"PostCard"}/>
                        </QueryClientProvider>
                    }
                    </div>


                </div>

                {/* Bottom Bar */}
                <div className={stlyes.bottomBar} id={"widthReference"}>
                    <Link href={"/media"}>
                        <img src="/media/images/Home.svg" alt="Home"/>
                    </Link>
                    <Link href={"/media/search"}>
                        <img src="/media/images/Search.svg" alt="Search"/>
                    </Link>
                    <Link href={"/media/new"} className={stlyes.big}>
                        <img src="/media/images/Add%20photo%20Home.svg" alt="Plus"/>
                    </Link>
                    <Link href={"/media/profile"}>
                        <img src="/media/images/Profile.svg" alt="Profile"/>
                    </Link>
                    <Link href={"/media/notifications"}>
                        <img src="/media/images/Notification.svg" alt="Notification"/>
                        {
                            notifications > 0 &&
                            <div className={stlyes.notification}>
                                <p>{notifications}</p>
                            </div>
                        }
                    </Link>
                </div>
            </div>
        </Wrapper>
    )
}