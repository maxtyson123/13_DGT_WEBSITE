import Wrapper from "@/pages/media/components/wrapper";
import stlyes from '@/styles/media/search.module.css'
import {useEffect, useState} from "react";
import {makeRequestWithToken} from "@/lib/api_tools";
import {PostCard} from "@/pages/media/components/cards";
import Link from "next/link";

export default function Page(){

    const [searchHistory, setSearchHistory] = useState<any[]>(["test"]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
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

        // Save to search history if it is not already there
        if(searchHistory.indexOf(searchQuery) === -1) {
            setSearchHistory([...searchHistory, searchQuery]);
        }
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
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
                    {searchResults.users.map((user, index) => {
                        return (
                            <button key={index} className={stlyes.searchResult}>
                                <p>{user.id}</p>
                            </button>
                        )
                    })}

                    <p>Plants</p>
                    {searchResults.plants.map((plant, index) => {
                        return (
                            <button key={index} className={stlyes.searchResult}>
                                <p>{plant.name}</p>
                            </button>
                        )
                    })}

                    <p>Posts</p>
                    {searchResults.posts.map((post, index) => {
                        return (
                            <button key={index} className={stlyes.searchResult}>
                                <PostCard id={post.id}/>
                            </button>
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
                        <div className={stlyes.searchBar}>
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