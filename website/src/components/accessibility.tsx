import {useEffect, useRef, useState} from "react";

interface ToggleAccessibilityProps {
    setting: string
    setter: (value: boolean) => void
}
export function ToggleAccessibilitySetting({setting, setter}: ToggleAccessibilityProps) {
    const toggleRef = useRef<HTMLInputElement>(null)

    const loader = () => {
        let loadedMode = localStorage.getItem(setting)
        let mode = false

        // If the mode is loaded as true, otherwise it must be false or incorrect
        if(loadedMode === "true"){
            mode = true
        }

        return mode
    }

    const toggle = () => {

        // Get the current mode
        const mode = loader()

        // Toggle the mode
        const newMode = !mode

        // Update the toggle
        toggleRef.current!.checked = newMode

        // Save the mode
        localStorage.setItem(setting, newMode.toString())

        // Update the state
        setter(newMode)
    }

    useEffect(() => {
        const mode = loader()

        // Load the mode when the component is mounted
        setter(mode)

        // Update the toggle
        toggleRef.current!.checked = mode
    }, [toggleRef.current])

    return (
        <>
            <div className="toggle-container" onClick={toggle}>
                <input ref={toggleRef} type="checkbox"/>
                <button className={"m-1"}>{setting}</button>
            </div>
        </>
    )

}

export function DarkMode(){


    const loadTheme = (isDark: boolean) => {
        // Get the root element
        const root = document.documentElement

        const theme = isDark ? "DARK" : "LIGHT"

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
        <ToggleAccessibilitySetting setting={"Dark Mode"} setter={loadTheme}/>
    )
}

export function Dyslexic(){

    const toggleDyslexic = (isEnabled : boolean) => {


        // Get the root element
        const root = document.documentElement

        // Set the dyslexic mode
        root.style.setProperty('--site-font', isEnabled ? "Open-Dyslexic" : "Archivo")


    }

    return(
        <>
            <ToggleAccessibilitySetting setting={"Dyslexic Mode"} setter={toggleDyslexic}/>
        </>
    )

}