import styles from "@/styles/input_sections.module.css";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";

type SmallInputProps = {
    placeHolder: string;
    required: boolean;
    state: "normal" | "error" | "success";
    errorText?: string;
    onChange?: (value: string) => void;
};
export function SmallInput({placeHolder, required, state, errorText = "", onChange}: SmallInputProps){

    // States to track
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const smallInputRef = useRef(null);

    // Update the height of the page header
    useEffect(() => {
        const smallInputElemt = smallInputRef.current;

        // Update CSS variable based on size if the element exists
        if(smallInputElemt){

            // Only change if there is the required text being displayed
            if(required){

                // Change the top spacing based on if the input is focused
                if(isInputFocused)
                    smallInputElemt.style.setProperty('--top-spacing', "8px");
                else
                    smallInputElemt.style.setProperty('--top-spacing', "18px");
            }
        }



    }, [isInputFocused, smallInputRef.current, required]);
    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleInputBlur = (e) => {
        setIsInputFocused(false);
    };

    let stateClass = "";
    switch (state) {
        case "normal":
            stateClass = styles.normal;
            break;

        case "error":
            stateClass = styles.error;
            break;

        case "success":
            stateClass = styles.success;
            break;
    }

    return(
        <>
            <div className={styles.smallInput + " " + stateClass} ref={smallInputRef}>
                <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                    {required ? 'Required' : ''}
                </p>
                {state === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}
                <input
                    type="text"
                    placeholder={placeHolder}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange(e.target.value); // Add this line
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                { state === "error" ? <p className={styles.errorText}>{errorText}</p> : ''}
            </div>
        </>

    )

}

export function DropdownInput(){
    return(
        <>

        </>
    )
}