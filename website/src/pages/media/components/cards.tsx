import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {ADMIN_USER_TYPE, EDITOR_USER_TYPE, MEMBER_USER_TYPE} from "@/lib/users";
import stlyes from "@/styles/media/cards.module.css";
import {getFilePath} from "@/lib/data";
import Image from "next/image";
import {loader_data} from "@/lib/loader_data";
import {getNamesInPreference, macronCodeToChar, numberDictionary} from "@/lib/plant_data";
import {fetchData} from "next-auth/client/_utils";
import {da} from "date-fns/locale";

export default function Page(){
    return <></>
}

interface PostCardProps {
    post_title: string,
    post_image: string,
    post_user_id: number,
    post_plant_id: number,
    post_date: string,
    id: number,
    like_count: number,
    user_liked: boolean,
}

export function PostCard(props: PostCardProps) {

    // Data
    const [timeAgo, setTimeAgo] = useState("")
    const [username, setUsername] = useState("Loading..")
    const [userImage, setUserImage] = useState("/media/images/small_loading.gif")
    const [userType, setUserType] = useState("")
    const [likes, setLikes] = useState(props.like_count)
    const [plantName, setPlantName] = useState("Loading...")
    const [width, setWidth] = useState(0)
    const [liked, setLiked] = useState(props.user_liked)

    // States
    const [lastTap, setLastTap] = useState(0)
    const [lastLikeTime, setLastLikeTime] = useState(0)
    const likeRef = useRef<HTMLDivElement>(null);

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
        const bottom = document.getElementById("widthReference");
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
        const user = await makeCachedRequest('user_data_'+props.post_user_id, '/api/user/data?id='+props.post_user_id);
        if(user.user_image && user.user_image != "undefined"){
            setUserImage(user.user_image);
        } else {
            setUserImage("/media/images/logo.svg");
        }
        setUsername(user.user_name);
        switch (user.user_type) {
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
        const plants = await makeCachedRequest('plants_names_all', '/api/plants/search?getNames=true&getUnpublished=true');
        const plant = plants.find((plant: any) => plant.id === props.post_plant_id);
        if(plant != null) {
            let name = macronCodeToChar(getNamesInPreference(plant)[0], numberDictionary);

            // Check if the name is too long
            if(name.length > 15) {
                name = name.substring(0, 15) + "..";
            }

            setPlantName(name);
        }

    }
    const goToProfile = () => {

        // Go to the users profile
        router.push("/media/profile?id="+props.post_user_id)
    }

    const likePost = async () => {
        await makeRequestWithToken("post", `/api/posts/likes?operation=like&id=${props.id}`);
    }

    const unlikePost = async () => {
        await makeRequestWithToken("post", `/api/posts/likes?operation=unlike&id=${props.id}`);
    }

    const toggleLike = async () => {

        // Get the time
        const time = new Date().getTime();

        // Check if the time is less than 300ms
        if(time - lastLikeTime < 300) {

            // Give let the request go through
            return;
        }

        // Set the last tap
        setLastLikeTime(time);

        // Toggle the like
        if(liked) {

            setLiked(false);
            await unlikePost();
            setLikes(likes - 1);



        } else {


            // Set the liked
            setLiked(true);

            // Show the like animation
            if(likeRef.current == null) return;
            likeRef.current.classList.remove(stlyes.likePopup);
            likeRef.current.classList.add(stlyes.likePopup);

            // Update the likes
            await likePost();
            setLikes(likes + 1);
        }
    }
    
    const detectDoubleTap = (e: any) => {

        // Get the time
        const time = new Date().getTime();

        // Check if the time is less than 300ms
        if(time - lastTap < 300) {
            toggleLike();
        }

        // Set the last tap
        setLastTap(time);
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
                    <div ref={likeRef}><img src="/media/images/Liked.svg" alt="Liked"/></div>
                    <Image
                        fill
                        placeholder={loader_data() as any}
                        src={getFilePath(props.post_user_id, props.id, props.post_image)}
                        alt={props.post_title}
                        onClick={detectDoubleTap}
                    />
                </div>
                <div className={stlyes.postFooter}>
                    <img src="/media/images/Share.svg" alt="Share"/>
                    <button onClick={toggleLike}>
                        <img src={liked ? "/media/images/Liked.svg" : "/media/images/Like.svg"} alt="Comment"/>
                        <p>{likes}</p>
                    </button>
                    <button onClick={() => {router.push("/plants/"+props.post_plant_id)}}>
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

interface PostCardApiProps {
    id: number
}

export function  PostCardApi(props: PostCardApiProps){

    const [data, setData] = useState<PostCardProps>()

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await makeRequestWithToken("get", `/api/posts/fetch?id=${props.id}&operation=data`);
        setData(response.data.data[0]);
    }

    return(<>
        {data != null ? <PostCard
            {...data}
        /> : <></>}
    </>)
}


interface UserCardProps {
    id: number
}
export function UserCard(props: UserCardProps) {

    const [username, setUsername] = useState("Loading..")
    const [userImage, setUserImage] = useState("/media/images/small_loading.gif")
    const [userType, setUserType] = useState("")
    const [followers, setFollowers] = useState(0)
    const dataFetch = useRef(false);

    useEffect(() => {
        if(dataFetch.current) return;
        dataFetch.current = true;
        fetchData();
    }, []);

    const fetchData = async () => {

        // Get the user information
        const user = await makeCachedRequest('user_data_'+props.id, '/api/user/data?id='+props.id);
        if(user.user_image && user.user_image != "undefined"){
            setUserImage(user.user_image);
        } else {
            setUserImage("/media/images/logo.svg");
        }
        setUsername(user.user_name);
        switch (user.user_type) {
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

        // Get the followers
        const followers = await makeRequestWithToken("get", `/api/user/follow?operation=followersCount&id=${props.id}`);
        setFollowers(followers.data.data[0]["COUNT(*)"]);
    }

    return(
        <>
            <div className={stlyes.user}>
                <img src={userImage} alt="Profile"/>
                <div className={stlyes.userInfo}>
                    <h1>{username}</h1>
                    <h2>{userType}</h2>
                </div>
                <h3>{followers}</h3>
            </div>
        </>
    )

}