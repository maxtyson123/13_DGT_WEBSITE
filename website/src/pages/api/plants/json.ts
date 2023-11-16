import {NextApiRequest, NextApiResponse} from 'next';
import {
    CleanAPIData,
    ConvertApiIntoPlantData,
    ConvertPlantDataIntoApi,
    convertTableDataToPlantData,
    fixAttachmentsPaths,
    macronsForDisplay,
    PlantData,
    PlantDataApi,
    ValidPlantData
} from "@/lib/plant_data";
import axios from "axios";
import {getClient} from "@/lib/databse";
import {checkApiPermissions} from "@/lib/api_tools";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {downloadPlantData} from "@/pages/api/plants/download";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // If the request is not a GET request, return an error
    if(request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed, please use GET' });
    }

    // Get the URL of the API
    const { headers } = request;
    const protocol = headers['x-forwarded-proto'] || 'http'; // Use the "x-forwarded-proto" header to determine the protocol, defaulting to "http"
    const host = headers['x-forwarded-host'] || headers['host']; // Use the "x-forwarded-host" header if it exists, otherwise fallback to "host"
    const url = `${protocol}://${host}`; // Construct the full URL using the protocol, host, and request URL


    // Get the ID and table from the query string
    const { operation, json, id, tableName } = request.query;

    // Get the client
    const client = await getClient()

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, "api:plants:json:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    // Try running the operation
    try {

        switch (operation) {
            case 'download':

                const permissionD = await checkApiPermissions(request, response, session, client, "api:plants:json:download")
                if(!permissionD) return response.status(401).json({error: "Not Authorized"})

                // If the ID is not found, return an error
                if(!id){
                    return response.status(404).json({ error: 'ID parameter not found' });
                }

                // If the ID is not a number, return an error
                if(isNaN(Number(id))){
                    return response.status(404).json({ error: 'ID parameter is not a number' });
                }

                const restrictedData = await checkApiPermissions(request, response, session, client, "data:plants:viewRestrictedSections")

                // Download the data from the database using the download API with the ID and table
                let plantsInfo = await downloadPlantData(["plants", "months_ready_for_use", "edible", "medical", "craft", "source", "custom", "attachments"], Number(id), client, restrictedData)

                // Check if there was an error
                if(plantsInfo[0] === "error"){
                    return response.status(404).json({ error: plantsInfo[1] });
                }

                // Get the data
                plantsInfo = plantsInfo[1][0];

                // Change the data into the PlantDataApi type
                // @ts-ignore
                let apiData = plantsInfo as PlantDataApi;

                // If the data is to be restricted then create empty text for the restricted data
                if(!restrictedData) {

                    // Clear the restricted data
                    apiData.medical_restricteds = [];

                    // Create empty text for the restricted data
                    for(let i = 0; i < apiData.medical_types.length; i++){
                        apiData.medical_restricteds.push("")
                    }
                }

                // Convert the string date into a date object
                if(apiData.last_modified){
                    apiData.last_modified = new Date(apiData.last_modified).toISOString();
                }

                // Clean the data
                apiData = CleanAPIData(apiData);

                // Convert the data into the PlantData format
                let plantOBJ = ConvertApiIntoPlantData(apiData);

                // If the data is null then return an error
                if(!plantOBJ){
                    return response.status(404).json({ error: 'Plant data count be converted into PlantData'});
                }

                // Set the id
                plantOBJ.id = Number(id);

                // Fix the data
                plantOBJ = fixAttachmentsPaths(plantOBJ);
                plantOBJ = macronsForDisplay(plantOBJ)

                return response.status(200).json({ data: plantOBJ});

            case 'upload':

                const permissionU = await checkApiPermissions(request, response, session, client, "api:plants:json:upload")
                if(!permissionU) return response.status(401).json({error: "Not Authorized"})

                // Check if the JSON param exists
                if (!json) {
                    // If it doesn't exist, return an error
                    return response.status(400).json({ error: 'No JSON param found' });
                }

                // Try parsing the JSON
                let parsed;
                try {
                    if (typeof json === "string") {
                        parsed = JSON.parse(json);
                    }

                } catch (error) {
                    // If there is an error, return the error
                    return response.status(400).json({  error: "Data is not JSON" });
                }

                // Check if JSON is in the PlantData format
                if (!ValidPlantData(parsed)) {
                    // If it isn't, return an error
                    return response.status(400).json({ error: "Data is not in PlantData format" });
                }

                // Convert the PlantData into the API format
                const uploadApiData = ConvertPlantDataIntoApi(parsed as PlantData) as any;

                // If the data is null then return an error
                if (!uploadApiData) {
                    return response.status(400).json({ error: "PlantData could not be converted into API format" });
                }

                // Upload the data to the database using the upload API by passing each json key as params
                let result = await axios.post(`${url}/api/plants/upload`, uploadApiData);

                // Return the data
                return response.status(200).json({ data: result.data });

            case "convert":
                const permissionC = await checkApiPermissions(request, response, session, client, "api:plants:json:convert")
                if(!permissionC) return response.status(401).json({error: "Not Authorized"})

                // Check if there is the tableName param
                if (!tableName) {
                    // If it doesn't exist, return an error
                    return response.status(400).json({ error: 'No tableName param found' });
                }

                // Get the spreadsheet data
                let spreadSheetJSON = await axios.get(`http://gsx2json.com/api?id=${process.env.PLANT_SPREADSHEET}&sheet=${tableName}`);

                // If there is a code error, return the error
                if(spreadSheetJSON.data.code){
                    return response.status(500).json({ error: spreadSheetJSON.data.message });
                }

                let plantData = convertTableDataToPlantData(spreadSheetJSON.data)
                plantData = macronsForDisplay(plantData);

                return response.status(200).json({ data: plantData });

            default:
                // If the operation is not found, return an error
                return response.status(404).json({ error: 'Operation not found' });
        }

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error:  (error as Error).message});
    }

}