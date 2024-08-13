import styles from "@/styles/components/input_sections.module.css";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCloudArrowUp, faFile} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import {toTitleCase} from "@/lib/data";


// States for the input
export type ValidationState = "normal" | "error" | "success";

/**
 * Hook for managing the state of an input field this includes validation and requirement.
 * @param {string} initialValue - The initial value of the input field.
 * @param {boolean} required - Indicates if the input field is required.
 * @param {ValidationState} state - The current validation state of the input field.
 * @param {function} setThisState - A function to update the validation state.
 * @param {function} setThisRequired - A function to update the required flag.
 * @returns {object} - An object containing the input field's state and related functions.
 */
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
    }, [state, required, setThisState, setThisRequired]);

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

/**
 * An input element that is styled to be small, will style it self-based on the validation state passed in, error text will be displayed if the state is "error". If it is required, the required text will be displayed but will be hidden when the input is focused. If there is a change event handler, it will be called when the input value changes. If there is a default value, it will be set as the initial value otherwise the placeholder will be displayed.
 *
 * @param {object} props - The component props.
 * @param {string} props.placeHolder - The placeholder text for the input field.
 * @param {string} props.defaultValue - The default value of the input field.
 * @param {boolean} props.required - Indicates if the input field is required.
 * @param {ValidationState} props.state - The current validation state of the input field.
 * @param {string} props.errorText - The error text to display when the state is "error".
 * @param {function} props.changeEventHandler - A function to handle input changes.
 *
 * @see {@link useInputState} for the hook that handles the input state.
 * @see {@link ValidationState} for the type of the validation state.
 *
 * @returns {JSX.Element} - The small input component.
 */
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

    const changeHandler = (value: string) => {
        setInputValue(value);

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
                {state === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                {/* Show the error text if the state is in error */}
                { state === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
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

/**
 * A dropdown input element, will style it self-based on the validation state passed in, error text will be displayed if the state is "error". If it is required, the required text will be displayed but will be hidden when the input is focused. If there is a change event handler, it will be called when the input value changes. If there is a default value, it will be set as the initial value otherwise the placeholder will be displayed.@param {object} props - The component props.
 *
 * @param {object} props - The component props.
 * @param {string} props.placeHolder - The placeholder text for the dropdown input.
 * @param {string} props.defaultValue - The default value of the dropdown input.
 * @param {boolean} props.required - Indicates if the dropdown input is required.
 * @param {ValidationState} props.state - The current validation state of the dropdown input.
 * @param {string} props.errorText - The error text to display when the state is "error".
 * @param {string[]} props.options - The available options for the dropdown input.
 * @param {function} props.changeEventHandler - A function to handle input changes.
 *
 * @see {@link useInputState} for the hook that handles the input state.
 * @see {@link ValidationState} for the type of the validation state.
 *
 * @returns {JSX.Element} - The dropdown input component.
 */
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

    /**
     * Handles the change event of the input. Sets the input value and calls the change event handler if it exists.
     *
     * @param value - The value of the input.
     */
    const changeHandler = (value: string) => {
        setInputValue(value);

        // Value has changed so state is no longer valid
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
                {state === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                {/* Show the error text if the state is in error */}
                { state === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
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

/**
 * A text area input element that will scale vertically with the text typed. Will style it self-based on the validation state passed in, error text will be displayed if the state is "error". If it is required, the required text will be displayed but will be hidden when the input is focused. If there is a change event handler, it will be called when the input value changes. If there is a default value, it will be set as the initial value otherwise the placeholder will be displayed.
 * @param {object} props - The component props.
 * @param {string} props.placeHolder - The placeholder text for the text area.
 * @param {string} props.defaultValue - The default value of the text area.
 * @param {boolean} props.required - Indicates if the text area is required.
 * @param {ValidationState} props.state - The current validation state of the text area.
 * @param {string} props.errorText - The error text to display when the state is "error".
 * @param {function} props.changeEventHandler - A function to handle input changes.
 *
 * @see {@link AdvancedTextArea} for a text area that allows for styling of the text input.
 * @see {@link useInputState} for the hook that handles the input state.
 * @see {@link ValidationState} for the type of the validation state.
 *
 * @returns {JSX.Element} - The simple text area component.
 */
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

    /**
     * Handles the change event of the input. Sets the input value and calls the change event handler if it exists.
     *
     * @param value - The value of the input.
     */
    const changeHandler = (value: string) => {
        setInputValue(value);

        // Value has changed so state is no longer valid
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
                {state === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}


                {/* Show the error text if the state is in error */}
                { state === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
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

/**
 * A wrapper for the react-quill component that will dynamically load the component as it requires access to the window object and cannot be server side rendered.
 *
 * @returns {JSX.Element} - The render quill component.
 */
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
/**
 * A text area input element that allows for the styling of the input text inside of it and automatically converts the styling to HTML to be rendered again later. Will style it self-based on the validation state passed in, error text will be displayed if the state is "error". If it is required, the required text will be displayed but will be hidden when the input is focused. If there is a change event handler, it will be called when the input value changes. If there is a default value, it will be set as the initial value otherwise the placeholder will be displayed.
 *
 * @param {object} props - The component props.
 * @param {string} props.placeHolder - The placeholder text for the text area.
 * @param {string} props.defaultValue - The default value of the text area.
 * @param {boolean} props.required - Indicates if the text area is required.
 * @param {ValidationState} props.state - The current validation state of the text area.
 * @param {string} props.errorText - The error text to display when the state is "error".
 * @param {function} props.changeEventHandler - A function to handle input changes.
 *
 * @see {@link SimpleTextArea} for a text area that does not allow for styling of the text input.
 * @see {@link RenderQuill} for the component that renders the text area.
 * @see {@link useInputState} for the hook that handles the input state.
 * @see {@link ValidationState} for the type of the validation state.
 *
 * @returns {JSX.Element} - The advanced text area component.
 */
export function AdvancedTextArea({placeHolder, defaultValue, required, state, errorText = "", changeEventHandler}: SimpleTextAreaProps) {

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

    /**
     * Handles the change event of the input. Sets the input value and calls the change event handler if it exists.
     *
     * @param value - The value of the input.
     */
    const changeHandler = (value: string) => {
        setInputValue(value);

        // Value has changed so state is no longer valid
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
                    {state === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                    {/* Show the error text if the state is in error */}
                    { state === "error" ? <p className={styles.errorText}>{errorText}</p> : ''}
                </div>
            </div>
        </>
    )

}

type FileInputProps = {
    placeHolder: string;
    defaultValue?: [string, string];
    required: boolean;
    state: ValidationState;
    errorText?: string;
    styleClass?: string;
    changeEventHandler?: (value: File) => void;
    size?: [number, number]
};
export function FileInput({placeHolder, defaultValue,  required, state, errorText = "", changeEventHandler, size = [100, 100], styleClass}: FileInputProps){

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);
    const [localFileUrl, setLocalFileUrl] = useState("");
    const [displayType, setDisplayType] = useState("file");

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

    /**
     * Handles the change event of the input. Sets the input value and calls the change event handler if it exists.
     *
     * @param event
     */
    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {

        // Prevent the default behaviour
        event.preventDefault();

        // Get the file from the event
        const selectedFile = event.target.files;

        // If there is no file selected then return
        if (!selectedFile) {
            return;
        }

        const file = selectedFile[0];

        setInputValue(file.name);
        handleFileDisplay(file);

        // Value has changed so state is no longer valid
        setThisState("normal")

        // Pass to the handler if it exists
        if (changeEventHandler) {
            changeEventHandler(file);
        }
    }

    const handleFileDisplay = (file: File) => {

        // If it is an image, display it
        if(file.type.includes("image")) {
            setLocalFileUrl(URL.createObjectURL(file))
            setDisplayType("image")
            return
        }

        // Set it to file
        setLocalFileUrl(file.name)
        setDisplayType("file")

    }

    useEffect(() =>{

        // If there is a default value, set it
        if(defaultValue && localFileUrl === ""){
            setLocalFileUrl(defaultValue[0])
            setDisplayType(defaultValue[1])
        }



    }, [defaultValue])

    return(
        <>
            {/*  The simple text area section */}
            <div className={styles.fileInput + " " + stateClass} ref={inputRef}>


                <div className={styles.selectBorder}>
                    {/* Show the required text if the input is not focused */}
                    <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                        {thisRequired ? 'Required' : ''}
                    </p>

                    {/* File Input */}
                    <div className={styles.uploadButton}>
                        <label htmlFor="files">

                            {localFileUrl ?
                                <>
                                    { displayType === "file" && <> <FontAwesomeIcon icon={faFile}/> <p> {localFileUrl} </p> </>}
                                    { displayType === "image" && <> <Image width={size[0]} height={size[1]} src={localFileUrl} alt="" className={styleClass ? styleClass : ""}/> </>}
                                    <p> Click To Change </p>
                                </>
                                :
                                <>
                                    <FontAwesomeIcon icon={faCloudArrowUp}/>
                                    <p> Select File </p>
                                </>
                            }
                           </label>
                        <input id="files" type="file" onChange={changeHandler} />
                    </div>

                    {/* Show the success icon if the state is in success and if the input is not focused */}
                    {state === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}
                    
                    {/* Show the error text if the state is in error */}
                    { state === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
                </div>
            </div>
        </>
    )
}

// Filterd search input
type FilteredSearchInputProps = {
    placeHolder: string;
    defaultValue?: string;
    required: boolean;
    state: ValidationState;
    errorText?: string;
    changeEventHandler?: (value: string) => void;
    options: string[];
    forceOptions?: boolean;
};

/**
 * A filtered search input element that will filter the options based on the input value. Will style it self-based on the validation state passed in, error text will be displayed if the state is "error". If it is required, the required text will be displayed but will be hidden when the input is focused. If there is a change event handler, it will be called when the input value changes. If there is a default value, it will be set as the initial value otherwise the placeholder will be displayed.
 *
 * @param {object} props - The component props.
 * @param {string} props.placeHolder - The placeholder text for the filtered search input.
 * @param {string} props.defaultValue - The default value of the filtered search input.
 * @param {boolean} props.required - Indicates if the filtered search input is required.
 * @param {ValidationState} props.state - The current validation state of the filtered search input.
 * @param {string} props.errorText - The error text to display when the state is "error".
 * @param {string[]} props.options - The available options for the filtered search input.
 * @param {function} props.changeEventHandler - A function to handle input changes.
 * @param {boolean} props.forceOptions - Does the input have to select an option from the list.
 *
 * @see {@link useInputState} for the hook that handles the input state.
 * @see {@link ValidationState} for the type of the validation state.
 *
 * @returns {JSX.Element} - The filtered search input component.
 */
export function FilteredSearchInput({placeHolder, defaultValue, required, state, errorText = "", options, changeEventHandler, forceOptions}: FilteredSearchInputProps) {

    // States to track
    const [thisState, setThisState] = useState(state);
    const [thisRequired, setThisRequired] = useState(required);
    const [animate, setAnimate] = useState(false);

    const [filteredOptions, setFilteredOptions] = useState<string[]>(options);

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

    /**
     * Handles the change event of the input. Sets the input value and calls the change event handler if it exists.
     *
     * @param value - The value of the input.
     */
    const changeHandler = (value: string) => {
        setInputValue(value);

        // Value has changed so state is no longer valid
        setThisState("normal")

        // Get the options
        let optionsToFilter = options;

        // Remove the macrons
        optionsToFilter = optionsToFilter.map(option => option.toLowerCase().replaceAll("ā", "a").replaceAll("ē", "e").replaceAll("ī", "i").replaceAll("ō", "o").replaceAll("ū", "u"));

        // Filter the options
        optionsToFilter = optionsToFilter.filter(option => option.toLowerCase().includes(value.toLowerCase()));

        // Set the first letter to be capital
        optionsToFilter = optionsToFilter.map(option => toTitleCase(option));

        // If there are no options, set the value to the input value (if force options is not set)
        if(optionsToFilter.length === 0 && forceOptions){
            optionsToFilter = ["Not available"];
        }else{

            // If there are more than 8 options, set 8 to be "More available"
            if(optionsToFilter.length > 8){
                optionsToFilter = [...optionsToFilter.slice(0, 7), "More available"];
            }

        }

        // Set the filtered options
        setFilteredOptions(optionsToFilter);



        // Pass to the handler if it exists
        if (changeEventHandler) {
            changeEventHandler(value);
        }
        setAnimate(true);
    }

    useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => setAnimate(false), 500);
            return () => clearTimeout(timer);
        }
    }, [animate]);

    useEffect(() =>{

        // If there is a default value, set it
        if(defaultValue){
            changeHandler(defaultValue)
        }
    }, [defaultValue])

    return(
        <>
            {/* The filtered search input section */}
            <div className={styles.filteredSearchInput + " " + stateClass} ref={inputRef}>

                {/* Show the required text if the input is not focused */}
                <p className={`${styles.required} ${isInputFocused ? styles.hidden : ''}`}>
                    {thisRequired ? 'Required' : ''}
                </p>

                {/* Filtered search input */}
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


                    {/* Show the top 8 options */}
                    <div className={styles.filteredOptions}>
                        {filteredOptions.slice(0, 8).map((option, index) => {
                            return <p
                                key={index}
                                onClick={() => changeHandler(option)}
                                style={{ "--delay": `${index * 0.05}s` } as React.CSSProperties}
                                className={(option == "More available" ? styles.moreAvailable : "") + " " + (animate ? styles.fadeIn : "")}
                            >
                                {option}
                            </p>
                        })}
                    </div>
                </div>




                {/* Show the success icon if the state is in success and if the input is not focused */}
                {state === "success" ? <FontAwesomeIcon icon={faCircleCheck} className={`${styles.icon} ${isInputFocused ? styles.hidden : ''}`}/> : ''}

                {/* Show the error text if the state is in error */}
                { state === "error" ? <p className={`${styles.errorText} ${isInputFocused ? styles.hidden : ''}`}>{errorText}</p> : ''}
            </div>
        </>
    )
}
