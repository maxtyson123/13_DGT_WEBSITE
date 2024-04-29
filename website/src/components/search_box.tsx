import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/components/search_box.module.css";

/**
 * Search box component. Renders a search box that redirects to the search page when submitted.
 *
 * @returns {JSX.Element} The rendered search box component.
 */
export default function SearchBox() {
    return(
        <>
            {/* Container for the search box, used for selection of elements */}
            <div className={styles.searchContainer}>

                {/* Use form action to redirect to the search page with the query as a parameter */}
                <form action="/search">
                    {/* Input for the search query */}
                    <input type="text" placeholder="Search.." name="query"/>

                    {/* Button to submit the form, uses the search icon from FontAwesome */}
                    <button type="submit"><FontAwesomeIcon icon={faSearch}/></button>
                </form>
            </div>
        </>
    )
}