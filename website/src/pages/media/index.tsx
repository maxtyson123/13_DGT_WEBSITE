import Wrapper from "@/pages/media/components/wrapper";
import stlyes from '@/styles/media/main.module.css'
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {InfiniteLoading} from "@/components/infinteLoading";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {fetchData} from "next-auth/client/_utils";
import {ADMIN_USER_TYPE, EDITOR_USER_TYPE, MEMBER_USER_TYPE} from "@/lib/users";
import {getFilePath} from "@/lib/data";
import {useRouter} from "next/router";


interface PostCardProps {
    post_title: string,
    post_image: string,
    post_user_id: number,
    post_plant_id: number,
    post_date: string,
    id: number
}

export function PostCard(props: PostCardProps) {


    const [timeAgo, setTimeAgo] = useState("")
    const [username, setUsername] = useState("Loading..")
    const [userImage, setUserImage] = useState("/media/images/small_loading.gif")
    const [userType, setUserType] = useState("")
    const [likes, setLikes] = useState(0)
    const [plantName, setPlantName] = useState("Loading...")
    const [width, setWidth] = useState(0)

    const router = useRouter();
    const dataFetch = useRef(false);

    useEffect(() => {

        // Get the time
        const date = new Date(props.post_date);

        // Get the current time
        const currentTime = new Date();

        // Get the difference
        const difference = currentTime.getTime() - date.getTime();

        // Get the time ago
        const seconds = difference / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const weeks = days / 7;

        // Convert into time ago
        if(weeks > 1) {
            setTimeAgo(Math.floor(weeks) + "w ago");
        } else if(days > 1) {
            setTimeAgo(Math.floor(days) + "d ago");
        } else if(hours > 1) {
            setTimeAgo(Math.floor(hours) + "hr ago");
        } else if(minutes > 1) {
            setTimeAgo(Math.floor(minutes) + "min ago");
        } else {
            setTimeAgo(Math.floor(seconds) + "s ago");
        }

    }, [props.post_date]);

    useEffect(() => {

        // Get the width of the bottom bar
        const bottom = document.getElementById("bottom");
        if(bottom == null) return;
        setWidth(bottom.offsetWidth);

        // Check if data has been fetched
        if(dataFetch.current) return;
        dataFetch.current = true;

        // Fetch the user information
        fetchData();
    }, []);

    const fetchData = async () => {

        // Get the user information
        const user = await makeRequestWithToken("get", `/api/user/data?id=${props.post_user_id}`);
        setUsername(user.data.data.user_name);
        setUserImage(user.data.data.user_image);
        switch (user.data.data.user_type) {
            case ADMIN_USER_TYPE:
                setUserType("Admin");
                break;
            case MEMBER_USER_TYPE:
                setUserType("Member");
                break;
            case EDITOR_USER_TYPE:
                setUserType("Editor");
                break;
            default:
                setUserType("Unknown");
        }


        // Get the plant information
        //todo

        // Get the likes
        //todo

    }

    const goToProfile = () => {

        // Go to the users profile
        router.push("/media/profile?id="+props.post_user_id)
    }

    return(
        <>
            <div className={stlyes.post} style={{width: width}}>
                <div className={stlyes.postHeader}>
                    <img src={userImage} alt="Profile" onClick={goToProfile}/>
                    <div className={stlyes.userInfo} onClick={goToProfile}>
                        <h1>{username}</h1>
                        <h2>{userType}</h2>
                    </div>
                    <div className={stlyes.dots}>
                        <span className={stlyes.dot}/>
                        <span className={stlyes.dot}/>
                        <span className={stlyes.dot}/>
                    </div>
                </div>
                <div className={stlyes.mainImage}>
                    <img src={getFilePath(props.post_user_id, props.id, props.post_image)} alt="Post"/>
                </div>
                <div className={stlyes.postFooter}>
                    <img src="/media/images/Share.svg" alt="Share"/>
                    <button>
                        <img src="/media/images/Like.svg" alt="Comment"/>
                        <p>{likes}</p>
                    </button>
                    <button>
                        <img src="/media/images/Coment.svg" alt="Comment"/>
                        <p>{plantName}</p>
                    </button>
                    <div /> {/* Gap */}
                    <p className={stlyes.time}>{timeAgo}</p>
                    <p className={stlyes.title}>{props.post_title}</p>
                </div>
            </div>
        </>
    )
}

export default function Home(){

    const dataFetch = useRef(false);
    const queryClient = new QueryClient()

    // Loading
    const [storiesLoading, setStorysLoading] = useState(true);

    // Data
    const [stories, setStories] = useState([]);

    useEffect(() => {

        // If the user has  not logged in, return

        if(dataFetch.current) return;

        dataFetch.current = true;

        // Fetch data here
        fetchData();

    }, []);

    const fetchData = async () => {

        // Fetch who the user is following
        const following = await makeRequestWithToken("get", "/api/user/follow?operation=list")
        // Get the following information
        if(following.data.data.length === 0) {
            setStorysLoading(false);
            return
        }

        const followingData = following.data.data.map((item: any) => item.following_id);



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

                    <button className={stlyes.message}>
                        <img src="/media/images/message.svg" alt="Messages"/>
                        <p>2</p>
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

                    <PostCard post_title={"A"} post_image={"b"} post_user_id={1} post_plant_id={1} post_date={1} id={1}/>
                    <PostCard post_title={"A"} post_image={"b"} post_user_id={1} post_plant_id={1} post_date={1} id={1}/>
                    <QueryClientProvider client={queryClient}>
                        <InfiniteLoading searchQuery={"/api/posts/fetch?operation=generalFeed"} display={"PostCard"}/>
                    </QueryClientProvider>

                </div>

                {/* Bottom Bar */}
                <div className={stlyes.bottomBar} id={"bottom"}>
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