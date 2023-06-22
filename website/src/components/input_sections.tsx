import styles from "@/styles/input_sections.module.css";
import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";


// States for the input (as type bc its typescript)
export type ValidationState = "normal" | "error" | "success";

export function useInputState(initialValue: string, required: boolean, state: ValidationState, setThisState: (state: ValidationState) => void, setThisRequired: (required: boolean) => void) {
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

    // Return the states and functions
    return {
        inputValue,
        setInputValue,
        inputRef,
        handleInputFocus,
        handleInputBlur,
        isInputFocused
    };
}

// Define the props needed and their types for the small input
type SmallInputProps = {
    placeHolder: string;
    defaultValue?: string;
    required: boolean;
    state: ValidationState;
    errorText?: string;
    changeEventHandler?: (value: string) => void;
};

export function SmallInput({placeHolder, defaultValue, required, state, errorText = "", changeEventHandler}: SmallInputProps){

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);

    // Get the states and functions from the hook
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

    const changeHandler = (value: string) => {
        setInputValue(value);

        // Value has chaned so state is no longer vali
        setThisState("normal")

        // Pass to the handler if it exists
        if (changeEventHandler) {
            changeEventHandler(value);
        }
    }

    useEffect(() =>{
        if(defaultValue){
            changeHandler(defaultValue)
        }
    }, [defaultValue])


    return(
        <>
            {/* The small input section */}
            <div className={styles.smallInput + " " + stateClass} ref={inputRef}>

                {/* Show the required text if the input is not focused */}
                <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                    {thisRequired ? 'Required' : ''}
                </p>

                {/* The input element, has a placeholder from the props, and a value from the state */}
                <div className={styles.selectBorder}>
                    <input
                        type="text"
                        placeholder={placeHolder}
                        value={inputValue}
                        onChange={(e) => {
                            changeHandler(e.target.value)
                        }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                    />
                </div>

                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
            </div>
        </>

    )

}

// Define the props needed and their types for the dropdown input
type DropdownInputProps = {
    placeHolder: string;
    defaultValue?: string;
    required: boolean;
    state: ValidationState;
    errorText?: string;
    changeEventHandler?: (value: string) => void;
    options: string[];
};
export function DropdownInput({placeHolder, defaultValue, required, state, errorText = "", options, changeEventHandler}: DropdownInputProps){

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);

    // Get the states and functions from the hook
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

    const changeHandler = (value: string) => {
        setInputValue(value);

        // Value has chaned so state is no longer vali
        setThisState("normal")

        // Pass to the handler if it exists
        if (changeEventHandler) {
            changeEventHandler(value);
        }
    }

    useEffect(() =>{

        // If there is a default value, set it
        if(defaultValue){
            changeHandler(defaultValue)
        }
    }, [defaultValue])

    return(
        <>
            {/* The dropdown input section */}
            <div className={styles.dropdownInput + " " + stateClass} ref={inputRef}>

                {/* Show the required text if the input is not focused */}
                <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                    {thisRequired ? 'Required' : ''}
                </p>

                {/* Dropdown input */}
                <div className={styles.selectBorder}>
                    <select
                        className={styles.dropDownSelect}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onChange={(e) => {
                            changeHandler(e.target.value);
                        }}
                    >

                        {/* The placeholder text, shouldn't be selectable, only show if no default value */}
                        {defaultValue? "" : <option value="" disabled selected hidden>{placeHolder}</option>}

                        {/* Map the options to the select options */}
                        {options.map((option, index) => {
                            return <option value={option} key={index} selected={option === defaultValue}> {option} </option>

                        })}
                    </select>

                </div>

                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
            </div>
        </>
    )
}

// Define the props needed and their types for the simple text area
type SimpleTextAreaProps = {
    placeHolder: string;
    defaultValue?: string;
    required: boolean;
    state: ValidationState;
    errorText?: string;
    changeEventHandler?: (value: string) => void;
};
export function SimpleTextArea({placeHolder, defaultValue,  required, state, errorText = "", changeEventHandler}: SimpleTextAreaProps){

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);

    // Get the states and functions from the hook
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

    const changeHandler = (value: string) => {
        setInputValue(value);

        // Value has chaned so state is no longer vali
        setThisState("normal")

        // Pass to the handler if it exists
        if (changeEventHandler) {
            changeEventHandler(value);
        }
    }

    useEffect(() =>{

        // If there is a default value, set it
        if(defaultValue){
            changeHandler(defaultValue)
        }
    }, [defaultValue])

    return(
        <>
            {/*  The simple text area section */}
            <div className={styles.simpleTextArea + " " + stateClass} ref={inputRef}>

                {/* Show the required text if the input is not focused */}
                <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                    {thisRequired ? 'Required' : ''}
                </p>

                {/* Text Area input */}
                <textarea
                    className={styles.simpleTextAreaTA}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={placeHolder}
                    value={inputValue}
                    onChange={(e) => {
                        // Update the value
                        changeHandler(e.target.value);
                    }}
                />

                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}


                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
            </div>
        </>
    )
}

// Define the props needed and their types for the render quill
interface RenderQuillProps {
    className?: string;
    theme?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

// Dynamically load the quill component as it requires access to the window object and cannot be server side rendered
const QuillNoSSRWrapper = dynamic(
    () =>  import('react-quill'),
    { ssr: false, loading: () => <p>Loading ...</p> },
)

// Define the render quill component using the dynamic component
class RenderQuill extends React.Component<RenderQuillProps>{
    render () {
        const { className, theme, onFocus, onBlur, value, onChange, placeholder} = this.props;
        return (
            <QuillNoSSRWrapper
                className={className}
                theme={theme}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
                value={value}
                onChange={onChange}
            />
        )
    }
}

// Advanced text area uses the same props as the simple text area
export function AdvandcedTextArea({placeHolder, defaultValue, required, state, errorText = "", changeEventHandler}: SimpleTextAreaProps) {

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);

    // Get the states and functions from the hook
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

    const changeHandler = (value: string) => {
        setInputValue(value);

        // Value has chaned so state is no longer vali
        setThisState("normal")

        // Pass to the handler if it exists
        if (changeEventHandler) {
            changeEventHandler(value);
        }
    }

    useEffect(() =>{

        // If there is a default value, set it
        if(defaultValue){
            changeHandler(defaultValue)
        }
    }, [defaultValue])

    return(
        <>
            {/* The advanced text area section */}
            <div className={styles.advancedTextArea + " " + stateClass} ref={inputRef}>

                <div className={styles.selectBorder}>

                    {/* Show the required text if the input is not focused */}
                    <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                        {thisRequired ? 'Required' : ''}
                    </p>

                    {/* Text Ara input */}
                    <RenderQuill
                        className={styles.editableDiv}
                        theme={"snow"}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        value={inputValue}
                        placeholder={placeHolder}
                        onChange={(e) => {
                            // Update the value
                            changeHandler(e);

                        }}
                    />

                    {/* Show the success icon if the state is in success and if the input is not focused */}
                    {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                    {/* Show the error text if the state is in error */}
                    { thisState === "error" ? <p className={styles.errorText}>{errorText}</p> : ''}
                </div>
            </div>
        </>
    )

}