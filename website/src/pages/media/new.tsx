import Wrapper from "@/pages/media/components/wrapper";
import styles from '@/styles/media/new.module.css'
import {useEffect, useRef, useState} from "react";
import {DropdownInput, SmallInput, ValidationState} from "@/components/input_sections";
import {makeRequestWithToken} from "@/lib/api_tools";
import {getNamesInPreference, macronCodeToChar, numberDictionary} from "@/lib/plant_data";


export default function Post(){


    const [postTitle, setPostTitle] = useState('');
    const [postValidation, setPostValidation] = useState<ValidationState>("normal")

    const [plant, setPlant] = useState('');
    const [plantValidation, setPlantValidation] = useState<ValidationState>("normal")

    const [plantNames, setPlantNames] = useState<string[]>(["Loading..."]);

    const dataFetch = useRef(false);
    useEffect(() => {

        // Check if data has been fetched
        if(dataFetch.current) return;
        dataFetch.current = true;

        // Fetch the plants
        fetchData();

    }, []);

    const fetchData = async () => {

        // Get the plants
        const response = await makeRequestWithToken('get', '/api/plants/search?getNames=true');
        const plants = response.data.data;

        // Get the plant names
        const plantNames = plants.map((plant : any) => macronCodeToChar(getNamesInPreference(plant)[0], numberDictionary));
        setPlantNames(plantNames);

    }

    return(
        <Wrapper>
            <div className={styles.page}>


                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button onClick={() => {window.location.href = '/media'}} className={styles.backButton}>
                        <img src={"/media/images/back.svg"}/>
                    </button>

                    <h1>New Post</h1>

                    <button onClick={() => {window.location.href = '/media/profile/settings'}} className={styles.editButton}>
                        <img src={"/media/images/Add photo.svg"}/>
                    </button>
                </div>

                {/* Create Post */}
                <div className={styles.createPost}>
                    <div className={styles.postImage}>
                        <p>Image Input</p>
                    </div>

                    <div className={styles.postTitle}>
                        <SmallInput placeHolder={"Post Title"} required={true} state={postValidation} changeEventHandler={setPostTitle}/>
                    </div>

                    <div className={styles.plantLink}>
                        <DropdownInput placeHolder={"Plant"} required={true} state={plantValidation} options={plantNames} changeEventHandler={setPlant}/>
                    </div>

                </div>

                {/* Post Button */}
                <div className={styles.postButton}>
                    <button>Post</button>
                </div>
            </div>
        </Wrapper>
    )
}