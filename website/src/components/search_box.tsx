import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/search_box.module.css";

export default function SearchBox() {
    return(
        <>
            <div className={styles.searchContainer}>
                <form action="/search">
                    <input type="text" placeholder="Search.." name="query"/>
                        <button type="submit"><FontAwesomeIcon icon={faSearch}/></button>
                </form>
            </div>
        </>
    )
}