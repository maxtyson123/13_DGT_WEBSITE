import Wrapper from "@/pages/media/components/wrapper";
import stlyes from '@/styles/media/search.module.css'
import {useEffect, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {PostCard, PostCardApi, UserCard} from "@/pages/media/components/cards";
import Link from "next/link";

export default function Page(){

    const [searchHistory, setSearchHistory] = useState<any[]>(["test"]);
    const [searchResults, setSearchResults] = useState<any>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchHistory = localStorage.getItem("searchHistory");
        if(searchHistory) {
            setSearchHistory(JSON.parse(searchHistory));
        }
    }, []);

    const search = async (query: string | undefined) => {

        // Set the query
        if(query) {
            document.querySelector("input")?.setAttribute("value", query);
        }

        // Get the search query
        setLoading(true);
        const searchQuery = document.querySelector("input")?.value;

        // Fetch the search results
        const results = await makeRequestWithToken("get", `/api/plants/search?name=${searchQuery}&getUsers=true&getPosts=true`);
        setSearchResults(results.data)

        // User has searched
        setHasSearched(true);
        setLoading(false);

        // Update the search history
        if(searchQuery && !searchHistory.includes(searchQuery)) {
            let history = [...searchHistory];
            history.push(searchQuery);
            setSearchHistory(history);
            localStorage.setItem("searchHistory", JSON.stringify(history));
        }
    }

    const loadingDisplay = () => {
        return (
            <>
                <img src={"/media/images/small_loading.gif"} width={100} height={100}/>
            </>
        )
    }

    const searchDisplay = () => {
        return(
            <>
                <div className={stlyes.searchResults}>
                    <h1> Search Results </h1>
                    <p>Users</p>
                    {searchResults.users.map((user: any, index: number) => {
                        return (
                            <Link href={"/media/profile?id=" + user.id} key={index} className={stlyes.searchResult}>
                                  <UserCard id={user.id}/>
                            </Link>
                        )
                    })}

                    <p>Posts</p>
                    {searchResults.posts.map((post: any, index: number) => {
                        return (
                            <div>
                                <PostCardApi id={post.id}/>
                            </div>
                        )
                    })}

                </div>
            </>
        )
    }

    const pastSearchDisplay = () => {
        return (
            <>
                <div className={stlyes.searchHistory}>
                    <p> History </p>
                    {searchHistory.map((item, index) => {
                        return (
                            <button key={index} className={stlyes.searchResult} onClick={() => search(item)}>
                                <p>{item}</p>
                                <img src={"/media/images/Search.svg"}/>
                            </button>
                        )
                    })}
                </div>
            </>
        )
    }

    return(
        <>
            <Wrapper>
                <div className={stlyes.page}>
                    <div className={stlyes.topBar}>
                        <Link href={"/media"}><img src={"/media/images/Back.svg"}/></Link>
                        <div className={stlyes.searchBar} id={"widthReference"}>
                            <input type="text" placeholder={"Enter your search..."}/>
                            <button onClick={() => {
                                search(undefined)
                            }}><img src={"/media/images/Search.svg"}/></button>
                        </div>
                    </div>

                    {loading ? loadingDisplay() : hasSearched ? searchDisplay() : pastSearchDisplay()}
                </div>
            </Wrapper>
        </>
    )

}