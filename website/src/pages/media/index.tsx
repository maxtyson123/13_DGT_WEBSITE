import Wrapper from "@/pages/media/components/wrapper";
import stlyes from '@/styles/media/main.module.css'
import Link from "next/link";

export default function Home(){

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
                        <div className={stlyes.story}>
                            <p> Follow More Users! </p>
                        </div>

                    </div>

                    <div className={stlyes.post}>
                        <div className={stlyes.postHeader}>
                            <img src="/media/images/logo.svg" alt="Profile"/>
                            <div className={stlyes.userInfo}>
                                <h1>Username</h1>
                                <h2>Admin</h2>
                            </div>
                            <div className={stlyes.dots}>
                                <span className={stlyes.dot}/>
                                <span className={stlyes.dot}/>
                                <span className={stlyes.dot}/>
                            </div>
                        </div>
                        <div className={stlyes.mainImage}>
                            <img src="https://rongoa.stream/plants/2/Kanuka%20-%20Old%20Mature%20Tree.jpg" alt="Post"/>
                        </div>
                        <div className={stlyes.postFooter}>
                            <img src="/media/images/Share.svg" alt="Share"/>
                            <button>
                                <img src="/media/images/Like.svg" alt="Comment"/>
                                <p>0</p>
                            </button>
                            <button>
                                <img src="/media/images/Coment.svg" alt="Comment"/>
                                <p>Plant Name</p>
                            </button>
                            <div /> {/* Gap */}
                            <p className={stlyes.time}>35 Min Ago</p>
                            <p className={stlyes.title}>Title</p>
                        </div>
                    </div>
                    <div className={stlyes.post}>
                        <div className={stlyes.postHeader}>
                            <img src="/media/images/logo.svg" alt="Profile"/>
                            <div className={stlyes.userInfo}>
                                <h1>Username</h1>
                                <h2>Admin</h2>
                            </div>
                            <div className={stlyes.dots}>
                                <span className={stlyes.dot}/>
                                <span className={stlyes.dot}/>
                                <span className={stlyes.dot}/>
                            </div>
                        </div>
                        <div className={stlyes.mainImage}>
                            <img src="https://rongoa.stream/plants/2/Kanuka%20-%20Old%20Mature%20Tree.jpg" alt="Post"/>
                        </div>
                        <div className={stlyes.postFooter}>
                            <img src="/media/images/Share.svg" alt="Share"/>
                            <button>
                                <img src="/media/images/Like.svg" alt="Comment"/>
                                <p>0</p>
                            </button>
                            <button>
                                <img src="/media/images/Coment.svg" alt="Comment"/>
                                <p>Plant Name</p>
                            </button>
                            <div /> {/* Gap */}
                            <p className={stlyes.time}>35 Min Ago</p>
                            <p className={stlyes.title}>Title</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={stlyes.bottomBar}>
                    <Link href={"/media"}>
                        <img src="/media/images/Home.svg" alt="Home"/>
                    </Link>
                    <Link href={"/media/search"}>
                        <img src="/media/images/Search.svg" alt="Search"/>
                    </Link>
                    <Link href={"/media/new"}>
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