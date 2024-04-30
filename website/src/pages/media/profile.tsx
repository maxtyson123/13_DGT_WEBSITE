import Wrapper from "@/pages/media/components/wrapper";
import styles from '@/styles/media/profile.module.css'
import {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {ADMIN_USER_TYPE, EDITOR_USER_TYPE, MEMBER_USER_TYPE, RongoaUser} from "@/lib/users";
import {makeRequestWithToken} from "@/lib/api_tools";
import {useRouter} from "next/router";
import {addMeasureSuffix} from "@/lib/data";
export default function Profile() {


    const [name, setName] = useState('');
    const [image, setImage] = useState('/media/images/logo.svg');
    const [role, setRole] = useState('');
    const [posts, setPosts] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
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
        const {id} = router.query;
        if(id) {

            // Check if id is a number
            if(isNaN(parseInt(id as string))) {
                router.push('/media');
            }

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
        }

        if(dataFetch.current) return;

        dataFetch.current = true;
        fetchData(id as string);

    }, [session]);


    const fetchData = async (id: string) => {

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

        const following = await makeRequestWithToken('get', `/api/user/follow?operation=followingCount${id ? `&id=${id}` : ''}`);
        const followers = await makeRequestWithToken('get', `/api/user/follow?operation=followersCount${id ? `&id=${id}` : ''}`);

        const followingCount = following.data.data[0]["COUNT(*)"];
        const followersCount = followers.data.data[0]["COUNT(*)"];

        setFollowers(followersCount);
        setFollowing(followingCount);

        setLoading(false);
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
                    <button onClick={() => {window.location.href = '/media'}} className={styles.backButton}>
                        <img src={"/media/images/back.svg"}/>
                    </button>

                    <h1>{myProfile ? 'My Profile' : 'Profile'}</h1>

                    {myProfile &&
                        <button onClick={() => {window.location.href = '/media/profile/settings'}} className={styles.editButton}>
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

                <div className={styles.postsContainer}>
                    <div className={styles.postsHeader}>
                        <button className={styles.postsButton + " " + styles.active}>Posts</button>
                        <button className={styles.postsButton}>Likes</button>
                        <button className={styles.postsButton}>More ...</button>
                    </div>

                    <div className={styles.posts}>
                        <div className={styles.post + " " + styles.main}>1</div>
                        <div className={styles.post}>2</div>
                        <div className={styles.post}>3</div>
                        <div className={styles.post}>4</div>
                    </div>
                </div>

            </div>
        </Wrapper>
    )


}