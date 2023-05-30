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
    const [month, setMonth] = React.useState(0)
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
            const monthEntries: MonthEntry[] = []

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

                monthEntries.push(monthEntry)
            }


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
                        {/* Map the month entries to the calender, if the current month is in their start and end month range */}
                        {monthEntries
                            .filter(entry => {
                                return month >= entry.startMonth && month <= entry.endMonth; // Check if current month is within range
                            })
                            .map((entry, index) => {
                                // Map the filtered entries to the calendar
                                return (
                                    <div key={entry.plant} className={styles.plant + " " + styles.onGoing}>
                                        <button onClick={prevMonth}><FontAwesomeIcon icon={faArrowLeft} /></button>
                                        <h1>{entry.plant} | {entry.event}</h1>
                                        <h2> ON-GOING </h2>
                                        <button onClick={nextMonth}> <FontAwesomeIcon icon={faArrowRight}/> </button>
                                    </div>
                                );
                            })}

                        <div className={styles.plant + " " + styles.end}>
                            <button onClick={prevMonth}><FontAwesomeIcon icon={faArrowLeft} /></button>
                            <h1>Plant | EVENT</h1>
                            <h2> END </h2>
                            <div></div>
                        </div>

                        <div className={styles.plant + " " + styles.start}>
                            <div></div>
                            <h1>Plant | EVENT</h1>
                            <h2> START </h2>
                            <button onClick={nextMonth}> <FontAwesomeIcon icon={faArrowRight}/> </button>
                        </div>


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