import {useEffect, useRef} from "react";

interface ToggleAccessibilityProps {
    setting: string
    setter: (value: boolean) => void
}


/**
 ToggleAccessibilitySetting component is used to render a toggle switch for an accessibility setting.

 @param {Object} props - The properties passed to the component.
 @param {string} props.setting - The name of the accessibility setting.
 @param {function} props.setter - The setter function to update the state of the accessibility setting.

 @returns {JSX.Element} - A JSX Element that contains a div with a toggle switch and a button.
 */
export function ToggleAccessibilitySetting({setting, setter}: ToggleAccessibilityProps) {
    const toggleRef = useRef<HTMLInputElement>(null)

    /**
     * Loads the accessibility setting from local storage
     *
     * @returns {boolean} - The accessibility setting
     */
    const loader = () => {
        let loadedMode = localStorage.getItem(setting)
        let mode = false

        // If the mode is loaded as true, otherwise it must be false or incorrect
        if(loadedMode === "true"){
            mode = true
        }

        return mode
    }

    /**
     * Toggles the accessibility setting between true and false, sets the toggle switch to the new mode, and saves the mode to local storage.
     */
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
    }, [setter, loader])

    return (
        <>
            {/* Div to contain the button and checkbox, if user clicks anywhere in this div then it will toggle */}
            <div className="toggle-container" onClick={toggle}>
                <input ref={toggleRef} type="checkbox"/>
                <button className={"m-1"}>{setting}</button>
            </div>
        </>
    )

}

/**
 * DarkMode component is used to render a toggle switch for dark mode. Uses the ToggleAccessibilitySetting component.
 *
 * @returns {JSX.Element} - A JSX Element that contains a <ToggleAccessibilitySetting> component.
 *
 * @see {@link ToggleAccessibilitySetting} for further information.
 */
export function DarkMode(){

    /**
     * Loads the theme based on the mode, this sets the main CSS variables.
     * @param isDark {boolean} - The mode of the theme, true for dark, false for light.
     */
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

/**
 * Dyslexic component is used to render a toggle switch for dyslexic mode. Dyslexic mode toggles the font between Archivo and Open Dyslexic  Uses the ToggleAccessibilitySetting component.
 *
 * @returns {JSX.Element} - A JSX Element that contains a <ToggleAccessibilitySetting> component.
 * @see {@link ToggleAccessibilitySetting} for further information.
 */
export function Dyslexic(){

    /**
     * Sets the '--site-font' CSS variable to either Open-Dyslexic or Archivo based on the mode.
     * @param isEnabled {boolean} - The mode of the font, true for Open-Dyslexic, false for Archivo.
     */
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