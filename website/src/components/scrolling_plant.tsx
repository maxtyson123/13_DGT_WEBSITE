import {Canvas, useThree} from "@react-three/fiber";
import {PlantModel} from "@/components/plant_model";
import {Environment} from "@react-three/drei";

/**
 * Renders the 3D scene with the plant model and the environment.
 *
 * @see {@link Scene} - The scene component.
 *
 * @returns {JSX.Element} The rendered scrolling plant component.
 */
export default function ScrollingPlant() {

    return(
        <>
            {/* Canvas component from react-three-fiber, this creates a 3D scene */}
            <Canvas shadows={true}>
                {/* Scene is used to add objects to the 3D scene and also programmatically interact with some components of the canvas */}
                <Scene />
            </Canvas>
        </>

    )

}

/**
 * The scene component, this is where the plant model and environment are added to the scene.
 *
 * @see {@link PlantModel} - The plant model component.
 *
 * @returns {JSX.Element} The rendered scene component.
 */
function Scene() {
    const { camera } = useThree();

    // Function to move the camera, used here instead of intial camera position to allow for the camera to be moved later
    // Additionally this helps for real time reloading of the page when in the dev environment as the camera will be automatically moved to the correct position
    const moveCamera = () => {
        camera.position.x = 0;
        camera.position.y = 15;
        camera.position.z = 7;
        camera.rotation.x = -1.2;
        camera.rotation.y = 0;
        camera.rotation.z = 0;


    };

    // Call the moveCamera function to set the initial camera position
    moveCamera();

    return (
        <>
            {/* Use the Environment component from drei to add HDR lighting to the scene */}
            <Environment files={"/data/forest_slope_1k.hdr"} />

            {/* Add the plant model to the scene */}
            <PlantModel/>
        </>
    );
}