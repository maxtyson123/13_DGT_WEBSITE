import Wrapper from "@/pages/media/components/wrapper";
import styles from '@/styles/media/new.module.css'
import {useEffect, useRef, useState} from "react";
import {DropdownInput, SmallInput, ValidationState} from "@/components/input_sections";
import {makeCachedRequest, makeRequestWithToken} from "@/lib/api_tools";
import {getNamesInPreference, macronCodeToChar, numberDictionary} from "@/lib/plant_data";
import {Loading} from "@/components/loading";
import {useSession} from "next-auth/react";
import {RongoaUser} from "@/lib/users";
import {cleanInput, getFilePath} from "@/lib/data";
import {useRouter} from "next/router";
import imageCompression from "browser-image-compression";


export default function Post(){


    const [postTitle, setPostTitle] = useState('');
    const [postValidation, setPostValidation] = useState<ValidationState>("normal")
    const [postError, setPostError] = useState<string>("")

    const [plant, setPlant] = useState('');
    const [plantValidation, setPlantValidation] = useState<ValidationState>("normal")
    const [plantError, setPlantError] = useState<string>("")

    const [plantNames, setPlantNames] = useState<string[]>(["Loading..."]);
    const [plantIDs, setPlantIDs] = useState<string[]>([""]);
    const [userIDs, setUserIDs] = useState<string[]>([]);

    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string>("");

    const [loading, setLoading] = useState("");

    const {data: session} = useSession();
    const [userID, setUserID] = useState<number>(0);

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

        const id = (session.user as RongoaUser).database.id;

        setUserID(id);
        followersFetch(id);




    }, [session]);

    const followersFetch = async (id: number) => {

        const followers = await makeRequestWithToken('get', '/api/user/follow?operation=listFollowers&id=' + id);
        const ids = followers.data.data

        let previousIDs = []
        for (let i = 0; i < ids.length; i++) {
            previousIDs.push(ids[i].follower_id)
        }
        setUserIDs(previousIDs)
        console.log(previousIDs)
    }

    const fetchData = async () => {

        // Get the plants
        const plants = await makeCachedRequest('plants_names_all', '/api/plants/search?getNames=true');

        // Get the plant names
        const plantNames = plants.map((plant : any) => macronCodeToChar(getNamesInPreference(plant)[0], numberDictionary));
        const plantIDs = plants.map((plant : any) => plant.id);

        setPlantNames(plantNames);
        setPlantIDs(plantIDs);

    }


    const fileChnage = (event: any) => {
        let file = event.target.files[0];
        if (file == null) return;

        setImage(file);
        setImageURL(URL.createObjectURL(file));
    }

    const router = useRouter();

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

        // Compress the image
        setLoading("Compressing Image...")
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        }
        let compressedFile;
        try {
            compressedFile = await imageCompression(image, options);
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

        } catch (error) {
            console.log(error);
            return
        }

        // Create a new file instance for the blob with the name and type from the original file
        const compressedImage = new File([compressedFile], image.name, {type: image.type});

        // Loading
        setLoading("Uploading Information...")
        const post_title = postTitle;
        const post_plant_id = plantIDs[plantNames.indexOf(plant)];
        const plant_image = cleanInput(compressedImage.name)

        console.log(post_plant_id)
        console.log(plantIDs)


        // Send the post data to the server
        const response = await makeRequestWithToken('post', '/api/posts/new?title=' + post_title + '&plant=' + post_plant_id + '&image=' + plant_image);

        console.log(response)
        console.log(userID)

        // Get the post id
        const newId = response.data.id

        // Upload the image
        setLoading("Uploading Image...")

        // Create a new form data object and append the file to it
        const formData = new FormData();
        formData.append('file', compressedImage);
        formData.append('id', newId);
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


        // Send the notification to the followers
        setLoading("Sending Notifications...")
        let uids = ""
        for (let i = 0; i < userIDs.length; i++) {
            uids += "&user_ids=" + userIDs[i]
        }
        console.log(uids)

        const response2 = await makeRequestWithToken('post', '/api/user/notifications?operation=send_notification' + uids + '&title=New Post&body=' + (session?.user as RongoaUser).name + ' has made a new post&image=' + getFilePath(userID, newId, plant_image));

        setLoading("")

        // Redirect to the post
        router.push("/media/")
    }

    return(
        <Wrapper>

            {loading != "" && <Loading progressMessage={loading}/>}

            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {
                        router.push("/media/")
                    }} className={styles.backButton}>
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