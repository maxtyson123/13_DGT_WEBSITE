import Wrapper from "@/pages/media/components/wrapper";
import styles from '@/styles/media/profile.module.css'
import {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {ADMIN_USER_TYPE, EDITOR_USER_TYPE, MEMBER_USER_TYPE, RongoaUser} from "@/lib/users";
import {makeRequestWithToken} from "@/lib/api_tools";
import {useRouter} from "next/router";
import {addMeasureSuffix, getFilePath} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import {loader_data} from "@/lib/loader_data";
export default function Index() {



    // User Info
    const [name, setName] = useState('');
    const [image, setImage] = useState('/media/images/logo.svg');
    const [role, setRole] = useState('');
    const [posts, setPosts] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);

    // Data
    const [postsData, setPostsData] = useState<any>([]);
    const [likesData, setLikesData] = useState<any>([])
    const [currentId, setCurrentId] = useState(0)
    const [currentReturnPath, setCurrentReturnPath] = useState('')

    // States
    const [showPosts, setShowPosts] = useState(true);
    const [moreActive, setMoreActive] = useState(false);
    const [iFollow, setIFollow] = useState(false);
    const [myProfile, setMyProfile] = useState(true);
    const [loading, setLoading] = useState(true);

    const dataFetch = useRef(false);
    const router = useRouter();

    const {data: session} = useSession();

    useEffect(() => {

        // Get the info from session
        if(!session?.user) return;

        // Get the id from the url params
        const {id, returnPath} = router.query;

        // Set the return path
        if(returnPath) setCurrentReturnPath(returnPath as string);

        if(id) {

            // Check if id is a number
            if(isNaN(parseInt(id as string))) {
                router.push('/media');
            }

            setCurrentId(parseInt(id as string));

            if(id != (session.user as RongoaUser).database.id.toString())
                setMyProfile(false);

        }else {
            const user = session.user as RongoaUser;

            setName(user.database.user_name);
            switch (user.database.user_type) {
                case ADMIN_USER_TYPE:
                    setRole('Admin');
                    break;
                case MEMBER_USER_TYPE:
                    setRole('Member');
                    break;
                case EDITOR_USER_TYPE:
                    setRole('Editor');
                    break;
                default:
                    setRole('Unknown');
            }
            if(user.database.user_image && user.database.user_image != "undefined") setImage(user.database.user_image);
            setCurrentId(user.database.id);
        }

        if(dataFetch.current) return;

        dataFetch.current = true;
        fetchData(id as string);

    }, [session]);


    const fetchData = async (id: string) => {
        setLoading(true);
        if(id) {

            // Update the profile info
            const userData = await makeRequestWithToken('get', `/api/user/data?id=${id}`);
            const user = userData.data.data;
            setName(user.user_name);
            switch (user.user_type) {
                case ADMIN_USER_TYPE:
                    setRole('Admin');
                    break;
                case MEMBER_USER_TYPE:
                    setRole('Member');
                    break;
                case EDITOR_USER_TYPE:
                    setRole('Editor');
                    break;
                default:
                    setRole('Unknown');
            }
            if(user.user_image && user.user_image != "undefined") setImage(user.user_image);

            // Check if the user is following
            const following = await makeRequestWithToken('get', `/api/user/follow?operation=checkFollowing&id=${id}`);
            setIFollow(following.data.data.length > 0);
        }

        // Get the stats
        const following = await makeRequestWithToken('get', `/api/user/follow?operation=followingCount${id ? `&id=${id}` : ''}`);
        const followers = await makeRequestWithToken('get', `/api/user/follow?operation=followersCount${id ? `&id=${id}` : ''}`);

        const followingCount = following.data.data[0]["COUNT(*)"];
        const followersCount = followers.data.data[0]["COUNT(*)"];

        setFollowers(followersCount);
        setFollowing(followingCount);


        // Get the posts
        const posts = await makeRequestWithToken('get', `/api/posts/fetch?operation=list&id=${(id ? id : (session?.user as RongoaUser).database.id)}`);
        console.log(posts);
        if(posts.data.data){
            // Reverse the posts
            posts.data.data.reverse();
            setPostsData(posts.data.data);
            setPosts(posts.data.data.length);
        }

        // Let the user be able to update the stats with follow/unfollow
        setLoading(false);

        // Get the likes
        const likes = await makeRequestWithToken('get', `/api/posts/likes?operation=list${id ? `&id=${id}` : ''}`);
        const likesIds = likes.data.data;
        if (likesIds.length === 0) return;

        const likesImage = await makeRequestWithToken('get', `/api/posts/fetch?operation=data&id=${likesIds.map((item: any) => item.like_post_id).join("&id=")}`);
        const likesImageData = likesImage.data.data;
        if (likesImageData.length === 0) return;

        // Reverse the likes and set the data
        likesImageData.reverse();
        setLikesData(likesImageData);
    }

    const handleFollowChange = async () => {
        const {id} = router.query;
        if(!id) return;

        setLoading(true);

        if(iFollow) {
            await makeRequestWithToken('get', `/api/user/follow?operation=unfollow&id=${id}`);
            setFollowers(followers - 1);
        }else {
            await makeRequestWithToken('get', `/api/user/follow?operation=follow&id=${id}`);
            setFollowers(followers + 1);
        }

        setIFollow(!iFollow);
        setLoading(false);
    }



    return(
        <Wrapper>
            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {
                        router.push('/media/'+currentReturnPath)
                    }} className={styles.backButton}>
                        <img src={"/media/images/back.svg"}/>
                    </button>

                    <h1>{myProfile ? 'My Profile' : 'Profile'}</h1>

                    {myProfile &&
                        <button onClick={() => {
                            router.push('/media/profile/settings')
                        }} className={styles.editButton}>
                            <img src={"/media/images/Settings.svg"}/>
                        </button>
                    }
                </div>

                <div className={styles.profileContainer}>
                    <div className={styles.profileImage}>
                        <img src={image} alt="Profile"/>
                    </div>
                    <div className={styles.profileInfo}>
                        <h1>{name}</h1>
                        <p>{role}</p>
                    </div>
                    { myProfile || loading ? null : <>
                        <div className={styles.followContainer}>
                            <button className={styles.followButton} onClick={handleFollowChange}>{iFollow ? 'Unfollow' : 'Follow'}</button>
                        </div>
                    </>
                    }
                    <div className={styles.profileStats}>
                        <div>
                            <h1>Posts</h1>
                            <p>{posts}</p>
                        </div>
                        <div>
                            <h1>Followers</h1>
                            <p>{addMeasureSuffix(followers)}</p>
                        </div>
                        <div>
                            <h1>Following</h1>
                            <p>{addMeasureSuffix(following)}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.postsContainer} id={"container"}>
                    <div className={styles.postsHeader}>
                        <button className={styles.postsButton + " " + (showPosts ? styles.active : "")} onClick={() => setShowPosts(true)}>Posts</button>
                        <button className={styles.postsButton + " " + (!showPosts ? styles.active : "")} onClick={() => setShowPosts(false)}>Likes</button>
                        <div className={styles.moreDropdown}>
                            <button className={styles.postsButton + " " + (moreActive ? styles.active : "")} onClick={() => setMoreActive(!moreActive)}>More ...</button>
                            <div className={moreActive ? styles.active : ""}>
                                <button>Share Profile</button>
                                <button onClick={() => {router.push("/account/"+currentId.toString())}}>View On Rongoa</button>
                                <button onClick={() => {fetchData(currentId.toString())}}>Refresh</button>
                            </div>
                        </div>
                    </div>

                    {
                        loading ?
                            <div className={styles.loader}>
                                <h1>Loading Posts...</h1>
                                <img src={"/media/images/small_loading.gif"} alt={"loading"}/>
                            </div>
                            :
                            <div className={styles.posts}>
                                {showPosts ?
                                    <>
                                    {
                                        postsData.map((post: any, index: number) => {
                                            return(
                                                <div className={styles.post + " " + (index == 0 ? styles.main : "") } key={post.id} >
                                                    <Image fill placeholder={loader_data() as any}  src={getFilePath(currentId, post.id, post.post_image)} alt="Post"/>
                                                </div>
                                            )
                                        })
                                    }
                                    </>
                                    :
                                    <>
                                    {
                                        likesData.map((post: any, index: number) => {
                                            return(
                                                <div className={styles.post + " " + (index == 0 ? styles.main : "") } key={post.id} >
                                                    <Image fill placeholder={loader_data() as any}  src={getFilePath(post.post_user_id, post.id, post.post_image)} alt="Post"/>
                                                </div>
                                            )
                                        })
                                    }
                                    </>
                                }
                                <p>User Has No More Posts</p>
                            </div>

                    }

                </div>

            </div>
        </Wrapper>
    )


}