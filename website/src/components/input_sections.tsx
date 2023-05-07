import styles from "@/styles/input_sections.module.css";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBold,
    faCircleCheck,
    faEraser,
    faItalic,
    faLink,
    faListUl,
    faStrikethrough,
    faUnderline
} from "@fortawesome/free-solid-svg-icons";

export function useInputState(initialValue: string, required: boolean, state: "normal" | "error" | "success", setThisState: (state: "normal" | "error" | "success") => void, setThisRequired: (required: boolean) => void) {
    // States to track
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update the sizing space for the required text
    useEffect(() => {
        const inputElement = inputRef.current;

        // Update CSS variable based on size if the element exists
        if (inputElement) {
            // Only change if there is the required text being displayed
            if (required) {
                // Change the top spacing based on if the input is focused
                if (isInputFocused){
                    inputElement.style.setProperty("--top-spacing", "8px");
                }
                else {
                    inputElement.style.setProperty("--top-spacing", "18px");
                }
            }else{
                inputElement.style.setProperty("--top-spacing", "8px");
            }
        }
    }, [isInputFocused, inputRef.current, required]);

    // Update the state if the state prop changes
    useEffect(() => {
        setThisState(state);
        setThisRequired(required);
    }, [state, required]);

    // When the input is focused, change the state
    const handleInputFocus = () => setIsInputFocused(true);
    const handleInputBlur = () => setIsInputFocused(false);

    return {
        inputValue,
        setInputValue,
        inputRef,
        handleInputFocus,
        handleInputBlur,
        isInputFocused
    };
}

type SmallInputProps = {
    placeHolder: string;
    required: boolean;
    state: "normal" | "error" | "success";
    errorText?: string;
    changeEventHandler?: (value: string) => void;
};

export function SmallInput({placeHolder, required, state, errorText = "", changeEventHandler}: SmallInputProps){

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);


    const { inputValue, setInputValue, inputRef, handleInputFocus, handleInputBlur, isInputFocused } = useInputState(
        "",
        required,
        state,
        setThisState,
        setThisRequired
    );

    // Set the state class based on the state
    let stateClass = "";
    switch (thisState) {
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
            {/* The small input section */}
            <div className={styles.smallInput + " " + stateClass} ref={inputRef}>

                {/* Show the required text if the input is not focused */}
                <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                    {thisRequired ? 'Required' : ''}
                </p>

                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                {/* The input element, has a placeholder from the props, and a value from the state */}
                <div className={styles.selectBorder}>
                    <input
                        type="text"
                        placeholder={placeHolder}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);

                            // User has changed the value, so the previous state is no longer valid
                            setThisState("normal");

                            // Pass to the handler if it exists
                            if (changeEventHandler) {
                                changeEventHandler(e.target.value);
                            }
                        }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                    />
                </div>
                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={styles.errorText}>{errorText}</p> : ''}
            </div>
        </>

    )

}

type DropdownInputProps = {
    placeHolder: string;
    required: boolean;
    state: "normal" | "error" | "success";
    errorText?: string;
    options: string[];
    changeEventHandler?: (value: string) => void;
};
export function DropdownInput({placeHolder, required, state, errorText = "", options, changeEventHandler}: DropdownInputProps){

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);


    const { inputValue, setInputValue, inputRef, handleInputFocus, handleInputBlur, isInputFocused } = useInputState(
        "",
        required,
        state,
        setThisState,
        setThisRequired
    );

    // Set the state class based on the state
    let stateClass = "";
    switch (thisState) {
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
            <div className={styles.dropdownInput + " " + stateClass} ref={inputRef}>

                {/* Show the required text if the input is not focused */}
                <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                    {thisRequired ? 'Required' : ''}
                </p>

                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}


                {/* Dropdown input */}
                <div className={styles.selectBorder}>
                    <select
                        className={styles.dropDownSelect}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onChange={(e) => {
                            // Update the value
                            setInputValue(e.target.value);

                            // User has changed the value, so the previous state is no longer valid
                            setThisState("normal")

                            // Pass to the handler if it exists
                            if (changeEventHandler) {
                                changeEventHandler(e.target.value);
                            }
                        }}
                    >

                        {/* The placeholder text, shouldn't be selectable */}
                        <option value="" disabled selected hidden>{placeHolder}</option>

                        {/* Map the options to the select options */}
                        {options.map((option, index) => {
                            return <option value={option} key={index}>{option}</option>
                        })}

                    </select>
                </div>

                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={styles.errorText}>{errorText}</p> : ''}
            </div>
        </>
    )
}


type SimpleTextAreaProps = {
    placeHolder: string;
    required: boolean;
    state: "normal" | "error" | "success";
    errorText?: string;
    changeEventHandler?: (value: string) => void;
};
export function SimpleTextArea({placeHolder, required, state, errorText = "", changeEventHandler}: SimpleTextAreaProps){

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);


    const { inputValue, setInputValue, inputRef, handleInputFocus, handleInputBlur, isInputFocused } = useInputState(
        "",
        required,
        state,
        setThisState,
        setThisRequired
    );

    // Set the state class based on the state
    let stateClass = "";
    switch (thisState) {
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
            <div className={styles.simpleTextArea + " " + stateClass} ref={inputRef}>

                {/* Show the required text if the input is not focused */}
                <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                    {thisRequired ? 'Required' : ''}
                </p>

                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}


                {/* Text Are input */}
                <textarea
                    className={styles.simpleTextAreaTA}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={placeHolder}
                    value={inputValue}
                    onChange={(e) => {
                        // Update the value
                        setInputValue(e.target.value);

                        // User has changed the value, so the previous state is no longer valid
                        setThisState("normal")

                        // Pass to the handler if it exists
                        if (changeEventHandler) {
                            changeEventHandler(e.target.value);
                        }
                    }}
                />

                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={styles.errorText}>{errorText}</p> : ''}
            </div>
        </>
    )
}

function combineStyles(previousStyling: string, newStyling: string) {

    // Split the styling into an array of strings, split by the tags
    const previousStylingArray = previousStyling.split(/(<[^>]*>)/g);
    const newStylingArray = newStyling.split(/(<[^>]*>)/g);


    // IF the previous styling is 1 then return the new styling as there are no previous styles to combine
    if (previousStylingArray.length === 1) {
        return newStyling;
    }

    // Find the text in the new styling that is wrapped in tags
    const newStyledText = newStylingArray[2];

    // Loop through the previous styling array
    let textFound = ""
    let tagEncountered = 0;
    for (let i = 0; i < previousStylingArray.length; i++) {


        // If the text is not a tag then add it to the text found
        if (!previousStylingArray[i].includes("<")) {

            // Try spit the text if it contains the new styled text
            const splitText = previousStylingArray[i].split(newStyledText);
            textFound += splitText[0];

            // If the text found now matches the before part of the new styling then this is where the new styling should be added
            if (textFound === newStylingArray[0] || textFound.length >= newStylingArray[0].length){

                // If the text is currently being wrapped in tags then add the tags to the text found. (tag encountered will be unenven if havent met closing tag yet)
                if (tagEncountered % 2 === 1) {
                    // Close the split text
                    splitText[0] = splitText[0] + previousStylingArray[i+1];

                    // Open the split text again
                    splitText[1] = previousStylingArray[i-1] + splitText[1];

                }


                // Get the new styling
                const newStyling = newStylingArray[1] + newStyledText + newStylingArray[3];

                // Replace the text in the array with the split text and the new styling in the middle
                //
                previousStylingArray[i] = splitText[0] + newStyling + splitText[1];

                break;
            }
        }
        else{
            tagEncountered++;
        }
    }

    // Combine the array into a string and return it
    return previousStylingArray.join("");
}

export function AdvandcedTextArea({placeHolder, required, state, errorText = "", changeEventHandler}: SimpleTextAreaProps) {

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);
    const editorRef = useRef(null);

    const { inputValue, setInputValue, inputRef, handleInputFocus, handleInputBlur, isInputFocused } = useInputState(
        "",
        required,
        state,
        setThisState,
        setThisRequired
    );

    // Set the state class based on the state
    let stateClass = "";
    switch (thisState) {
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

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        // Get the id of the button as that is the action that needs to be performed
        const buttonId = e.currentTarget.id;

        // Check if there is an editor ref
        if (!editorRef.current) return;

        // Get the selection
        const selection = window.getSelection();
        if (!selection) return;

        // Get the text selected
        const range = selection.getRangeAt(0);
        if (!range) return;

        // Check what node to make
        let type = "";
        switch (buttonId) {
            case "Bold":
                type = "strong";
                break;

            case "Italic":
                type = "em";
                break;

            case "Underline":
                type = "u";
                break;

            case "Strike":
                type = "del";
                break;

            case "Bullet":
                type = "li";
                break;

            case "Link":
                type = "a";
                break

            case "Clear":
                type = "span";
                break;


            default:
                type = "span";
                break;
        }

        // Create a new node
        const newNode = document.createElement(type);
        newNode.appendChild(document.createTextNode(range.toString()));


        //If it's a link add the href
        if (buttonId === "Link") {
            const link = prompt("Enter the link", "https://");
            if (!link) return;

            newNode.setAttribute("href", link);
        }

        // Get the all the content before the selection
        const beforeRange = range.cloneRange();
        beforeRange.selectNodeContents(editorRef.current);
        beforeRange.setEnd(range.startContainer, range.startOffset);
        const beforeText = beforeRange.toString();
        const beforeNode = document.createTextNode(beforeText);

        // Get the all the content after the selection
        const afterRange = range.cloneRange();
        afterRange.selectNodeContents(editorRef.current);
        afterRange.setStart(range.endContainer, range.endOffset);
        const afterText = afterRange.toString();
        const afterNode = document.createTextNode(afterText);

        // Store the previous styling and then clear the div
        const previousStyling = editorRef.current.innerHTML;
        editorRef.current.innerHTML = "";

        // Add the nodes in the correct order
        editorRef.current.appendChild(beforeNode);
        editorRef.current.appendChild(newNode);
        editorRef.current.appendChild(afterNode);

        const newStyling = editorRef.current.innerHTML;

        editorRef.current.innerHTML = combineStyles(previousStyling, newStyling, beforeText)
        
        // Update the state
        setInputValue(editorRef.current.innerHTML);
        if (changeEventHandler) {
            changeEventHandler(editorRef.current.innerHTML);
        }
    };

    return(
        <>
            {/* The small input section */}
            <div className={styles.advancedTextArea + " " + stateClass} ref={inputRef}>

                {/* The input element, has a placeholder from the props, and a value from the state */}
                <div className={styles.selectBorder}>

                    {/* Use a custom version of a editable div to make a style able text area */}
                    <div className={styles.advancedTA}>
                        {/* Top bar containing the buttons for the styling*/}
                        <div className={styles.topBar}>
                            <button className={styles.topBarButton} onClick={handleButtonClick} id={"Clear"}> <FontAwesomeIcon icon={faEraser} /> </button>
                            <button className={styles.topBarButton} onClick={handleButtonClick} id={"Bold"}> <FontAwesomeIcon icon={faBold} /> </button>
                            <button className={styles.topBarButton} onClick={handleButtonClick} id={"Italic"}> <FontAwesomeIcon icon={faItalic} /> </button>
                            <button className={styles.topBarButton} onClick={handleButtonClick} id={"Strike"}> <FontAwesomeIcon icon={faStrikethrough} /> </button>
                            <button className={styles.topBarButton} onClick={handleButtonClick} id={"Underline"}> <FontAwesomeIcon icon={faUnderline} /> </button>
                            <button className={styles.topBarButton} onClick={handleButtonClick} id={"Bullet"}> <FontAwesomeIcon icon={faListUl} /> </button>
                            <button className={styles.topBarButton} onClick={handleButtonClick} id={"Link"}> <FontAwesomeIcon icon={faLink} /> </button>
                        </div>
                        {/* Show the required text if the input is not focused */}
                        <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                            {thisRequired ? 'Required' : ''}
                        </p>

                        {/* Show the success icon if the state is in success and if the input is not focused */}
                        {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                        {/* Text area for user to input into*/}
                        <div className={styles.editableDiv}
                             contentEditable={true}
                             onFocus={handleInputFocus}
                             onBlur={handleInputBlur}
                             ref={editorRef}
                             onInput={(e) => {

                                 // Update the value
                                 setInputValue(editorRef.current.innerHTML);

                                 // User has changed the value, so the previous state is no longer valid
                                 setThisState("normal")

                                 // Pass to the handler if it exists
                                 if (changeEventHandler) {
                                     changeEventHandler(editorRef.current.innerHTML);
                                 }
                             }}>
                            {placeHolder}
                        </div>
                    </div>
                </div>
                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={styles.errorText}>{errorText}</p> : ''}
            </div>
        </>

    )

}