import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useEffect, useRef} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/calendar.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {MONTHS, USE_POSTGRES} from "@/lib/constants"
import {getFromCache, saveToCache} from "@/lib/cache";
import {getNamesInPreference, macronCodeToChar, numberDictionary, PlantData} from "@/lib/plant_data";
import Link from "next/link";
import {makeRequestWithToken} from "@/lib/api_tools";
import {Layout} from "@/components/layout";

interface MonthEntry {
    id: number,
    startMonth: number,
    endMonth: number,
    plant: string,
    event: string
}

export default function Calendar(){
    const pageName = "Calendar"

    // Store the month states
    const [month, setMonth] = React.useState(new Date().getMonth())
    const [monthName, setMonthName] = React.useState(MONTHS[month])
    const [monthEntries, setMonthEntries] = React.useState<MonthEntry[]>([])

    // Increment the month
    const nextMonth = () => {
        // Set the month to the month with the index one higher, cycle back to 0 if the month is 11
        const currentMonth = month
        const nextMonth = currentMonth < 11 ? currentMonth + 1 : 0
        setMonth(nextMonth)
    }

    // Decrement the month
    const prevMonth = () => {
        // Set the month to the month with the index one lower, cycle back to 11 if the month is 0
        const currentMonth = month
        const nextMonth = currentMonth > 0 ? currentMonth - 1 : 11
        setMonth(nextMonth)

    }

    // Update the month name when the month changes
    useEffect(() => {
        setMonthName(MONTHS[month])
    }, [month])


    // Don't fetch the data again if it has already been fetched
    const dataFetch = useRef(false)


    useEffect( () => {

        // Prevent the data from being fetched again
        if (dataFetch.current)
            return
        dataFetch.current = true

        fetchData().then(() => {console.log("Data fetched")} ).catch((error) => {console.log(error)});
    }, []);

    async function fetchData() {
        try {

            let res = null;

            const storedData = getFromCache("plant_months");

            // Check if the data is already in the session storage (this is to prevent the data from being fetched multiple times)
            if (storedData !== null) {
                // Get the data from the session storage
                res = storedData;

            }else{

                console.log("Fetching data")

                // Get the data from the API
                res = await makeRequestWithToken("get",'/api/plants/months');

                // Get the contents of the response
                res = res.data;

                // Store in the cache
                saveToCache("plant_months", res)
            }

            const data = res.data;

            console.log(data);

            // Create an array to store the month entries
            const entries: MonthEntry[] = []

            // Convert the data into an array of month entries
            for (let i = 0; i < data.length; i++) {

                const entry = data[i];
                const monthEntry: MonthEntry = {
                    id: entry.id,
                    startMonth:  USE_POSTGRES ? MONTHS.indexOf(entry.start_month) : MONTHS.indexOf(entry.months_start_month),
                    endMonth: USE_POSTGRES ? MONTHS.indexOf(entry.end_month) : MONTHS.indexOf(entry.months_end_month),
                    plant: macronCodeToChar(getNamesInPreference(entry as PlantData)[0], numberDictionary),
                    event: USE_POSTGRES ? entry.event : entry.months_event
                }


                // If either the start or end month is null then skip this entry
                if (monthEntry.startMonth === -1 || monthEntry.endMonth === -1)
                    continue;

                // Store the entry
                console.log(monthEntry);
                entries.push(monthEntry)
            }

            setMonthEntries(entries)


        } catch (err) {
            console.log(err);
        }

    }


    return(
        <>
            <Layout pageName={pageName} header={pageName}>
                {/* Calendar */}
                <Section autoPadding>

                    {/* Calendar header */}
                    <div className={styles.calendarContainer}>

                        {/* The current month and the buttons to change the month */}
                        <div className={styles.month}>
                            <button onClick={prevMonth}><FontAwesomeIcon icon={faArrowLeft}/></button>
                            <h1>{monthName}</h1>
                            <button onClick={nextMonth}><FontAwesomeIcon icon={faArrowRight}/></button>
                        </div>

                        <div className={styles.plants}>

                            {/* Map the entry's for this month */}
                            {monthEntries
                                .map((entry, index) => {
                                    return <EventEntryDisplayed key={entry.plant + index} entry={entry} month={month}
                                                                prevMonth={prevMonth} nextMonth={nextMonth}/>;

                                })}
                        </div>
                    </div>


                </Section>
            </Layout>
        </>
    )
}

interface EventEntryDisplayedProps {
    entry: MonthEntry,
    month: number
    prevMonth: () => void,
    nextMonth: () => void
}
function EventEntryDisplayed({entry, month, prevMonth, nextMonth}: EventEntryDisplayedProps){

    let type = ""
    let style = null

    // If the month is the same as the start month then the event is starting this month
    if (entry.startMonth === entry.endMonth) {
        if (entry.startMonth === month) {

            // Update the type and style
            type = "Start/End";
            style = styles.startEnd;
        }

    // If the month is the same as the end month then the event is ending this month
    }else if (entry.startMonth === month){

        // Update the type and style
        type = "Start"
        style = styles.start

    // If the month is the same as the end month then the event is ending this month
    }else if (entry.endMonth === month){

        // Update the type and style
        type = "End"
        style = styles.end

    // If the month is between the start and end month then the event is ongoing
    }else if (month > entry.startMonth && month < entry.endMonth){

        // Update the type and style
        type = "OnGoing"
        style = styles.onGoing
    }else{
        // If this is reached then the month is not between the start and end month, but it still could be looped around (e.g dec - march)
        // If the end month is less than the start month then the event is ongoing
        if(entry.endMonth < entry.startMonth){
            if ((month >= entry.startMonth && month <= 12) || (month >= 1 && month < entry.endMonth)) {
                type = "OnGoing";
                style = styles.onGoing;
            }
        }
    }

    // If there is no type then it must not be this month so return
    if (type === "") {
        return null;
    }


    // Map the filtered entries to the calendar
    return (
            <>
                    {/* Display the entry */}
                    <div className={styles.plant + " " + style}>
                        {/* If it is ending or ongoing then display the button to go back a month */}
                        {type === "End" || type === "OnGoing" ? <button className={styles.monthElementButton} onClick={prevMonth}><FontAwesomeIcon icon={faArrowLeft} /></button> : <div/>}

                        {/* Display the name, event and type */}
                        <Link href={`/plants/${entry.id}`}>
                            <h1>{entry.plant} | {entry.event}</h1>
                        </Link>
                        <h2> {type} </h2>

                        {/* If it is starting or ongoing then display the button to go forward a month */}
                        {type === "Start" || type === "OnGoing" ? <button className={styles.monthElementButton} onClick={nextMonth}><FontAwesomeIcon icon={faArrowRight} /></button> : <div/>}
                    </div>
            </>
    )

}