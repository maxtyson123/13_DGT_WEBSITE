import Navbar from "@/components/navbar";
import HtmlHeader from "@/components/html_header";
import React, {useEffect, useRef} from "react";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/calender.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {MONTHS} from "@/modules/constants"
import {getFromCache, saveToCache} from "@/modules/cache";
import axios from "axios";
import {getNamesInPreference, PlantData} from "@/modules/plant_data";
import Link from "next/link";

interface MonthEntry {
    id: number,
    startMonth: number,
    endMonth: number,
    plant: string,
    event: string
}

type CalenderRef = React.ForwardedRef<HTMLDivElement>
export default function Calender(ref: CalenderRef){
    const pageName = "Calender"
    const [month, setMonth] = React.useState(new Date().getMonth())
    const [monthName, setMonthName] = React.useState(MONTHS[month])
    const [monthEntries, setMonthEntries] = React.useState<MonthEntry[]>([])

    const nextMonth = () => {
        const currentMonth = month
        const nextMonth = currentMonth < 11 ? currentMonth + 1 : 0
        setMonth(nextMonth)
    }

    const prevMonth = () => {
        const currentMonth = month
        const nextMonth = currentMonth > 0 ? currentMonth - 1 : 11
        setMonth(nextMonth)

    }

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

        fetchData();
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

                // Get the data from the API
                res = await axios.get('/api/plants/months');

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
                    startMonth:  MONTHS.indexOf(entry.start_month),
                    endMonth: MONTHS.indexOf(entry.end_month),
                    plant: getNamesInPreference(entry as PlantData)[0],
                    event: entry.event
                }


                // If ether the start or end month is null then skip this entry
                if (monthEntry.startMonth === -1 || monthEntry.endMonth === -1)
                    continue;

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
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>


            {/* Page header */}
            <Section>
               <PageHeader size={"small"}>
                     <h1 className={styles.title}>Calender</h1>
               </PageHeader>
            </Section>

            {/* Calender */}
            <Section autoPadding>

                <div className={styles.calenderContainer}>
                    <div className={styles.month}>
                        <button onClick={prevMonth}><FontAwesomeIcon icon={faArrowLeft} /></button>
                        <h1>{monthName}</h1>
                        <button onClick={nextMonth}> <FontAwesomeIcon icon={faArrowRight}/> </button>
                    </div>

                    <div className={styles.plants}>

                        {/* Map the months that start */}
                        {monthEntries
                            .map((entry, index) => {

                               return <EventEntryDisplayer key={entry.plant} entry={entry} month={month}/>;

                        })}
                    </div>
                </div>


            </Section>


            {/* Page footer */}
            <Section>
                <Footer/>
            </Section>

            <ScrollToTop/>

           
        </>
    )
}

interface EventEntryDisplayerProps{
    entry: MonthEntry,
    month: number
}
function EventEntryDisplayer({entry, month}: EventEntryDisplayerProps){

    let type = ""
    let style = null

    if (entry.startMonth === entry.endMonth) {
        if (entry.startMonth === month) {
            type = "Start/End";
            style = styles.startEnd;
        }
    }else if (entry.startMonth === month){
        type = "Start"
        style = styles.start
    }else if (entry.endMonth === month){
        type = "End"
        style = styles.end
    }else if (month > entry.startMonth && month < entry.endMonth){
        type = "OnGoing"
        style = styles.onGoing
    }else{
        if(entry.endMonth < entry.startMonth){
            if ((month >= entry.startMonth && month <= 12) || (month >= 1 && month < entry.endMonth)) {
                type = "OnGoing";
                style = styles.onGoing;
            }
        }
    }


    if (type === "") {
        return null;
    }


    // Map the filtered entries to the calendar
    return (
        <div className={styles.plant + " " + style}>
            <div></div>
            <Link href={`/plants/${entry.id}`}>
                <h1>{entry.plant} | {entry.event}</h1>
            </Link>
            <h2> {type} </h2>

            <div></div>
        </div>

    )

}