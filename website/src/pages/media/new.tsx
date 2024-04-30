import Wrapper from "@/pages/media/components/wrapper";
import styles from '@/styles/media/new.module.css'
import {useEffect, useRef, useState} from "react";
import {DropdownInput, SmallInput, ValidationState} from "@/components/input_sections";
import {makeRequestWithToken} from "@/lib/api_tools";
import {getNamesInPreference, macronCodeToChar, numberDictionary} from "@/lib/plant_data";
import {Loading} from "@/components/loading";
import {useSession} from "next-auth/react";
import {RongoaUser} from "@/lib/users";


export default function Post(){


    const [postTitle, setPostTitle] = useState('');
    const [postValidation, setPostValidation] = useState<ValidationState>("normal")
    const [postError, setPostError] = useState<string>("")

    const [plant, setPlant] = useState('');
    const [plantValidation, setPlantValidation] = useState<ValidationState>("normal")
    const [plantError, setPlantError] = useState<string>("")

    const [plantNames, setPlantNames] = useState<string[]>(["Loading..."]);
    const [plantIDs, setPlantIDs] = useState<string[]>([""]);

    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string>("");

    const [loading, setLoading] = useState("");

    const {data: session} = useSession();
    const [userID, setUserID] = useState<string>("");

    const dataFetch = useRef(false);
    useEffect(() => {

        // Check if data has been fetched
        if(dataFetch.current) return;
        dataFetch.current = true;

        // Fetch the plants
        fetchData();

    }, []);

    useEffect(() => {
        if(session?.user == null) return;
        setUserID((session.user as RongoaUser).id);
    }, [session]);

    const fetchData = async () => {

        // Get the plants
        const response = await makeRequestWithToken('get', '/api/plants/search?getNames=true');
        const plants = response.data.data;

        // Get the plant names
        const plantNames = plants.map((plant : any) => macronCodeToChar(getNamesInPreference(plant)[0], numberDictionary));
        const plantIDs = plants.map((plant : any) => plant.id);
        setPlantNames(plantNames);

    }


    const fileChnage = (event: any) => {
        const file = event.target.files[0];
        if (file == null) return;

        setImage(file);
        setImageURL(URL.createObjectURL(file));
    }

    const post = async () => {

        // Check if there is a image
        if(image == null)
            return

        // Check if there is a title
        if(postTitle == ""){
            setPostValidation("error")
            setPostError("Please enter a title")
            return
        }

        // Check if the title is too long
        if(postTitle.length > 100){
            setPostValidation("error")
            setPostError("Title is too long")
            return
        }

        // Check if there is a plant
        if(plant == ""){
            setPlantValidation("error")
            setPlantError("Please select a plant")
            return
        }

        // Loading
        setLoading("Uploading Infomation...")
        const title = postTitle;
        const plantID = plant;


        // Upload the image
        setLoading("Uploading Image...")

        // Create a new form data object and append the file to it
        const formData = new FormData();
        formData.append('file', image);
        formData.append('id', userID);
        formData.append('path', 'users/' + userID + '/posts');

        try {
            // Send the form data to the server
            console.log("Uploading file")
            const response = await makeRequestWithToken('post', '/api/files/upload', formData);

            // Check if the file was uploaded successfully
            if (!response.data.error) {
                console.log("File uploaded successfully")
            }

        } catch (error) {
            console.log('An error occurred.');
        }

    }

    return(
        <Wrapper>

            {loading != "" && <Loading progressMessage={loading}/>}

            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {window.location.href = '/media'}} className={styles.backButton}>
                        <img src={"/media/images/back.svg"} alt={"back"}/>
                    </button>

                    <h1>New Post</h1>

                    <button onClick={post} className={styles.editButton}>
                        <img src={"/media/images/Add photo.svg"} alt={"new post"}/>
                    </button>
                </div>

                {/* Create Post */}
                <div className={styles.createPost}>


                    <div className={styles.postImage}>

                        {
                            imageURL == "" ?
                                <button onClick={() => {document.getElementById("cameraInput")?.click()}}>
                                    <img src={"/media/images/camera.svg"} alt={"add photo"}/>
                                </button>

                                :
                                <img src={imageURL} alt={"post"}/>
                        }

                    </div>

                    <div className={styles.postTitle}>
                        <SmallInput placeHolder={"Post Title"} required={true} state={postValidation}
                                    changeEventHandler={setPostTitle}/>
                    </div>

                    <div className={styles.plantLink}>
                        <DropdownInput placeHolder={"Plant"} required={true} state={plantValidation}
                                       options={plantNames} changeEventHandler={setPlant}/>
                    </div>


                    {/* Photo input using the front camera */}
                    <input type={"file"} accept={"image/*"} capture={"environment"} id={"cameraInput"} style={{display: "none"}} onChange={fileChnage}/>
                </div>

                {/* Post Button */}
                <div className={styles.postButton}>
                <button onClick={post}>Post</button>
                </div>
            </div>
        </Wrapper>
    )
}