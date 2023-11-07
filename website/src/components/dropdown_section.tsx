import {useState} from "react";
import styles from "@/styles/components/dropdown_section.module.css";

interface DropdownSectionProps {
    title: string;
    children: React.ReactNode;
    open?: boolean;
}


export function DropdownSection({title, children, open = false}: DropdownSectionProps){

    const [opened, setOpened] = useState(open)


    return(

        <>
            <div className={styles.titleBar}>
                <h1 className={styles.title}>{title}</h1>
                <button className={styles.button} onClick={() => setOpened(!opened)}> {opened ? "Close" : "Open"}</button>
            </div>
            <div className={styles.content + " " + (opened ? styles.open : styles.closed)}>
                {opened && children}
            </div>
        </>

    )

}