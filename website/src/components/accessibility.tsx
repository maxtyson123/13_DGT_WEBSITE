import {useState} from "react";

export function DarkMode(){

    const [darkMode, setDarkMode] = useState(false)

    const toggleDarkMode = () => {
        console.log("Toggling dark mode")

        // Toggle the dark mode
        setDarkMode(!darkMode)

        // Get the root element
        const root = document.documentElement

        // Get the current theme
        const theme = darkMode ? "DARK" : "LIGHT"

        console.log(root.style.getPropertyValue("--LIGHT-dark-background"))

        switch (theme) {
            case "LIGHT":
                root.style.setProperty('--main-background', "#ffffff")
                root.style.setProperty('--darker-main-background', "#CFD3D5")
                root.style.setProperty('--dark-background', "#000000")
                root.style.setProperty('--text-light', "#FFFFFF")
                root.style.setProperty('--text-dark', "#000000")
                root.style.setProperty('--main-green', "green")
                root.style.setProperty('--darker-main-green', "#0A670A")
                root.style.setProperty('--dark-green', "#084808")
                root.style.setProperty('--secondary-gray', "#D9D9D9")
                root.style.setProperty('--darker-secondary-gray', "#A0A4A6")
                root.style.setProperty('--blue', "#00B4D8")
                root.style.setProperty('--shadow', "black")
                root.style.setProperty('--shadow-less', "rgba(0,0,0,0.75)")
                root.style.setProperty('--shadow-min', "rgba(0,0,0,0.1)")
                break;

            case "DARK":
                root.style.setProperty('--main-background', "#000000")
                root.style.setProperty('--darker-main-background', "#383535")
                root.style.setProperty('--dark-background', "#FFFFFF")
                root.style.setProperty('--text-light', "#000000")
                root.style.setProperty('--text-dark', "#FFFFFF")
                root.style.setProperty('--main-green', "green")
                root.style.setProperty('--darker-main-green', "#0A670A")
                root.style.setProperty('--dark-green', "#084808")
                root.style.setProperty('--secondary-gray', "#6d7072")
                root.style.setProperty('--darker-secondary-gray', "#505354")
                root.style.setProperty('--blue', "#01424f")
                root.style.setProperty('--shadow', "white")
                root.style.setProperty('--shadow-less', "rgba(255,255,255,0.5)")
                root.style.setProperty('--shadow-min', "rgba(255,255,255,0.1)")
                break;

        }
    }

    return(
        <>
            <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
        </>
    )

}