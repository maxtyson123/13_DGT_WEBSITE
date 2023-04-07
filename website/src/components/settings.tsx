import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

export default function Settings(props: any) {
    // Constant variables
    const enabled = props.enabled;
    const [darkMode, setDarkMode] = React.useState(true);

    // CSS Styling
    const settingsContainer = "w-11/12 rounded-2xl m-5 text-center flex justify-center items-center flex-wrap";
    const settingCard = "bg-cyan-400/60 rounded-2xl p-3 m-5 text-white text-center shadow-lg";
    const displaySettings = {
        maxHeight: enabled ? "10000px" : "0",
        opacity: enabled ? "1" : "0",
        overflow: "hidden",
    }

    // Toggle Dark Mode
    function toggleDarkMode() {
        // Toggle the dark mode
        setDarkMode(!darkMode);
        console.log("Dark mode: ", darkMode)
    }

    return(
        <>

            <div style={displaySettings} className={"w-full"}>
                <h1 className={"text-center text-4xl pt-72 font-semibold"}>Settings</h1>

                <div className={settingsContainer}>

                    {/* Dark mode card*/}
                    <div className={settingCard}>
                        {/* Toggle Switch from frostbite*/}
                        <div className={"pt-1"}>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input onClick={toggleDarkMode} type="checkbox" value="" className="sr-only peer" defaultChecked={darkMode}/>
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"/>
                                <span className="ml-3">Dark Mode</span>
                            </label>
                        </div>
                    </div>

                    {/* Font changer card */}
                    <div className={settingCard}>
                        <div className={"pt-1"}>
                            <div className={"dropdown"}>
                                <button className={"dropbtn p-3 border-blue-700 border-2 bg-blue-600"}>Change Font <FontAwesomeIcon icon={faArrowDown}/></button>
                                <div className={"dropdown-content bg-blue-600 rounded-b-2xl"}>
                                    <a href="#">Font 1</a>
                                    <a href="#">Font 2</a>
                                    <a href="#">Font 3</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={settingCard}>
                        <div className={"pt-1"}>
                            <div className={"dropdown"}>
                                <button className={"p-3 border-blue-700 border-2 bg-blue-600"}>Change Language <FontAwesomeIcon icon={faArrowDown}/></button>
                                <div className={"dropdown-content bg-blue-600 rounded-b-2xl"} style={{minWidth: "171px"}}>
                                    <a href="#">Lang 1</a>
                                    <a href="#">Lang 2</a>
                                    <a href="#">Lang 3</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </>
    );

}