import styles from "@/styles/input_sections.module.css";
import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

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
                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
            </div>
        </>

    )

}

type DropdownInputProps = {
    placeHolder: string;
    required: boolean;
    state: "normal" | "error" | "success";
    errorText?: string;
    changeEventHandler?: (value: string) => void;
    options: string[];
    allowCustom: boolean;
};
export function DropdownInput({placeHolder, required, state, errorText = "", options, changeEventHandler, allowCustom}: DropdownInputProps){

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);
    const [customOption, setCustomOption] = useState(false)


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

    const changeHandler = () =>{

    }

    return(
        <>
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

                            // Set if the user has selected custom option
                            setCustomOption(e.target.value === "Custom");

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

                        {/* Allow for the user to add a custom choice */}
                        {allowCustom ? <option value={"Custom"}>{"Custom"}</option>  : ""}

                    </select>

                </div>


                {/* Allow for the user to enter their custom choice */}
                {customOption ?
                    <>
                        <br/>
                        <SmallInput
                            placeHolder={"Custom Option"}
                            required={true}
                            state={state}
                            changeEventHandler={(value) => {
                                // Update the value
                                setInputValue(value);

                                // User has changed the value, so the previous state is no longer valid
                                setThisState("normal")

                                // Pass to the handler if it exists
                                if (changeEventHandler) {
                                    changeEventHandler(value);
                                }

                            }}
                        />
                    </>
                    : ""}

                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
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

                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}


                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
            </div>
        </>
    )
}

const QuillNoSSRWrapper = dynamic(
    () =>  import('react-quill'),
    { ssr: false, loading: () => <p>Loading ...</p> },
)

class RenderQuill extends React.Component {
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
    return(
        <>
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
                            setInputValue(e);

                            // User has changed the value, so the previous state is no longer valid
                            setThisState("normal")

                            // Pass to the handler if it exists
                            if (changeEventHandler) {
                                changeEventHandler(e);
                            }
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


type DateSelectorProps = {
    placeHolder: string;
    required: boolean;
    state: "normal" | "error" | "success";
    errorText?: string;
    changeEventHandler?: (value: string) => void;
};

export function DateSelector({placeHolder, required, state, errorText = "", changeEventHandler}: DateSelectorProps){

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
            {/* The input section */}
            <div className={styles.dateInput + " " + stateClass} ref={inputRef}>

                <p className={styles.tooltip} >{placeHolder}</p>

                {/* Show the required text if the input is not focused */}
                <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                    {thisRequired ? 'Required' : ''}
                </p>

                {/* The input element, has a placeholder from the props, and a value from the state */}
                <div className={styles.selectBorder}>
                    <input
                        type="date"
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

                {/* Show the success icon if the state is in success and if the input is not focused */}
                {thisState === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}


                {/* Show the error text if the state is in error */}
                { thisState === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
            </div>
        </>

    )

}