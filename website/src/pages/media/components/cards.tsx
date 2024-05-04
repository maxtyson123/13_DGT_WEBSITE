import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {ADMIN_USER_TYPE, EDITOR_USER_TYPE, MEMBER_USER_TYPE} from "@/lib/users";
import stlyes from "@/styles/media/main.module.css";
import {getFilePath} from "@/lib/data";
import Image from "next/image";
import {loader_data} from "@/lib/loader_data";
import {getNamesInPreference, macronCodeToChar, numberDictionary} from "@/lib/plant_data";

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