import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {PlantModel} from "@/components/plant_model";
import {useRef} from "react";


export default function ScrollingPlant() {

    return(
        <>
            <Canvas shadows={true}>
                <Scene />
            </Canvas>


        </>

    )

}

function Scene() {
    const { camera } = useThree();

    // Function to move the camera
    const moveCamera = () => {
        camera.position.x = 0;
        camera.position.y = 11;
        camera.position.z = 11;
        camera.rotation.x = -0.85;
        camera.rotation.y = 0;
        camera.rotation.z = 0;


    };

    // Call the moveCamera function to set the initial camera position
    moveCamera();


    return (
        <>
            <ambientLight color={"white"} intensity={0.8} />
            <pointLight position={[-3, 5, -2]} intensity={0.8}/>
            <PlantModel/>
        </>
    );
}