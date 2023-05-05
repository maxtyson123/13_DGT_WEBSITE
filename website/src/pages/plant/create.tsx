import React, {useState} from "react";
import PageHeader from "@/components/page_header";
import styles from "@/styles/create.module.css";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import {DropdownInput, SmallInput} from "@/components/input_sections";


export default function CreatePlant() {

    // Page Constants
    const pageName = "Create Plant"
    const [plantName, setPlantName] = useState("...")

    // Value Setters
    const [englishName, setEnglishName] = useState("")
    const [moariName, setMoariName] = useState("")
    const [latinName, setLatinName] = useState("")

    // Value Handlers
    const handleEnglishNameChange = (value) => { setEnglishName(value); };
    const handleMoariNameChange = (value) => { setMoariName(value); };
    const handleLatinNameChange = (value) => { setLatinName(value); };

    return (
        <>
            {/* Set up the page header and navbar */}
            <HtmlHeader currentPage={pageName}/>
            <Navbar currentPage={pageName}/>

            {/* Set up the page header */}
            <PageHeader size={"medium"}>
                <h1 className={styles.title}>Creating plant: {plantName}</h1>
            </PageHeader>

            {/* Divide the page into a left and right collum*/}
            <div className={styles.column}>

                {/* Basic plant information */}
                <div className={styles.formSection}>

                    {/* Section title */}
                    <h1 className={styles.sectionTitle}> Basic Info</h1>

                    {/* Plant name */}
                    <div className={styles.formItem}>
                        <SmallInput
                            placeHolder={"English Name"}
                            required={false}
                            state={"normal"}
                            onChange={handleEnglishNameChange}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <SmallInput
                            placeHolder={"Moari Name"}
                            required={false}
                            state={"normal"}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <SmallInput
                            placeHolder={"Latin Name"}
                            required={false}
                            state={"normal"}
                        />
                    </div>

                    {/* Preferred plant name */}
                    <div className={styles.formItem}>
                        <DropdownInput
                            placeHolder={"Preferred Name"}
                            required={false}
                            state={"normal"}
                            options={["English", 'Moari', "Latin"]}
                        />
                    </div>

                </div>

            </div>
            <div className={styles.column}>
                <h2>Column 2</h2>
                <p>Some text..</p>
            </div>
        </>
    )


}