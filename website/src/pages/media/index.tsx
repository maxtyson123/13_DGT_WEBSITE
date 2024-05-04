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

export default function Home(){

    const dataFetch = useRef(false);
    const queryClient = new QueryClient()
    const router = useRouter()
    // Loading
    const [storiesLoading, setStorysLoading] = useState(true);

    // Data
    const [stories, setStories] = useState([]);
    const [following, setFollowing] = useState("");
    const [id, setId] = useState(0);

    const {data: session} = useSession();

    useEffect(() => {

        // If the user has  not logged in, return

        if(dataFetch.current) return;

        dataFetch.current = true;

        // Fetch data here
        fetchData();

    }, []);

    // Get the user id
    useEffect(() => {


        //Check if the user is logged in
        if(!session?.user) return;


        // Get the user id
        setId((session.user as RongoaUser).database.id);


    }, [session]);

    const fetchData = async () => {

        // Fetch who the user is following
        const following = await makeRequestWithToken("get", "/api/user/follow?operation=list")

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

                    { following &&
                        <QueryClientProvider client={queryClient}>
                            <InfiniteLoading searchQuery={`/api/posts/fetch?operation=generalFeed&following=${following}&id=${id}`} display={"PostCard"}/>
                        </QueryClientProvider>
                    }


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
                    </Link>
                </div>
            </div>
        </Wrapper>
    )
}