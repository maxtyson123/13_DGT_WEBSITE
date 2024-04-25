import React, {useEffect, useRef, useState} from "react";
import styles from "@/styles/components/table.module.css";
import {globalStyles} from "@/lib/global_css";

interface TableProps {
    children: React.ReactNode;
}

export default function Table({ children }: TableProps) {


    const [search, setSearch] = useState("")
    const alreadySetup = useRef(false)

    // On first render, set a listener for all the headers in the table
    useEffect(() => {

        // If the listener has already been set up, don't set it up again
        if (alreadySetup.current)
            return

        alreadySetup.current = true

        // Get all the headers in the table
        const headers = document.querySelectorAll("th")

        // Loop through each header and add a listener to sort the table
        headers.forEach((header) => {

            // Set the sort mode data attribute to ascending
            header.setAttribute("data-sort", "none")

            // Add a hover listener to the header to show the sort icon
            header.addEventListener("mouseenter", () => {


                const asc_sort = header.getAttribute("data-sort") === "ascending"

                // If the header doesn't already have the sort icon, add it
                if (header.innerHTML.indexOf("<span>") === -1)
                    header.innerHTML += asc_sort ? "<span>&#x25B2;</span>" : "<span>&#x25BC;</span>"

            })

            // Remove the hover listener when the mouse leaves the header
            header.addEventListener("mouseleave", () => {

                // Remove the sort icon
                header.removeChild(header.lastChild as any)
            })

            // When the header is clicked, sort the table
            header.addEventListener("click", () => {

                // Get the sort mode of the header
                let sort = header.getAttribute("data-sort")
                switch (sort) {
                    case "none":
                        sort = "ascending"
                        break
                    case "ascending":
                        sort = "descending"
                        break
                    case "descending":
                        sort = "ascending"
                        break
                }

                // Set the sort mode of the header
                header.setAttribute("data-sort", sort ? sort : "none")
                header.removeChild(header.lastChild as any)
                header.innerHTML += sort === "ascending" ? "<span>&#x25B2;</span>" : "<span>&#x25BC;</span>"

                console.log("Sort: " + sort)

                // Get the index of the header
                const index = Array.from(header.parentElement?.children as any).indexOf(header)

                // Get all the rows in the table
                const rows = Array.from(document.querySelectorAll("tr"))

                // Get the rows that are not the header
                const data = rows.slice(1)

                // Sort the rows
                data.sort((a, b) => {
                    if (sort === "ascending") {
                        return a.childNodes[index].textContent?.localeCompare(b.childNodes[index].textContent as any)  as any
                    } else if (sort === "descending") {
                        return b.childNodes[index].textContent?.localeCompare(a.childNodes[index].textContent as any)  as any
                    }
                    return 0
                })

                // Remove the rows from the table
                rows.forEach((row) => row.remove())

                // Add the rows back to the table in the sorted order
                data.forEach((row) => document.querySelector("table")?.appendChild(row))

                // Add the header back to the table
                document.querySelector("table")?.prepend(rows[0])
            })
        })

    }, [])

    // When the user types in the search bar, filter the table
    useEffect(() => {

        // Get all the rows in the table
        const rows = document.querySelectorAll("tr")

        // Loop through each row and hide the ones that don't match the search
        rows.forEach((row) => {
            let show = false

            // Check if any of the cells in the row match the search
            row.childNodes.forEach((cell) => {
                if (cell.textContent?.toLowerCase().includes(search.toLowerCase())) {
                    show = true
                }
            })

            // Hide the row if it doesn't match the search
            row.style.display = show ? "" : "none"
        })

    }, [search])

    return (
        <div className={styles.mainTable}>
            <div className={globalStyles.gridCentre}>
                <input type="text" placeholder="Search..." className={styles.searchBar} onChange={(e) => setSearch(e.target.value)}/>
                <table>
                    {children}
                </table>
            </div>
        </div>
    )

}