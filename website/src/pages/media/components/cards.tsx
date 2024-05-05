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

export default function Page(){
    return <></>
}

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
        const plants = await makeCachedRequest('plants_names_all', '/api/plants/search?getNames=true');
        const plant = plants.find((plant: any) => plant.id === props.post_plant_id);
        if(plant != null) {
            setPlantName(macronCodeToChar(getNamesInPreference(plant)[0], numberDictionary));
        }

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
                    <Image
                        fill
                        placeholder={loader_data() as any}
                        src={getFilePath(props.post_user_id, props.id, props.post_image)}
                        alt={props.post_title}
                    />
                </div>
                <div className={stlyes.postFooter}>
                    <img src="/media/images/Share.svg" alt="Share"/>
                    <button>
                        <img src="/media/images/Like.svg" alt="Comment"/>
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

    const [data, setData] = useState<any>()

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await makeRequestWithToken("get", `/api/posts/fetch?id=${props.id}&operation=data`);
        setData(response.data.data[0]);
    }

    return(<>
        {data != null ? <PostCard
            post_title={data.post_title}
            post_image={data.post_image}
            post_user_id={data.post_user_id}
            post_plant_id={data.post_plant_id}
            post_date={data.post_date}
            id={data.id}
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