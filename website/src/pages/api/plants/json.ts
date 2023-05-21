import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';
import {
    CleanAPIData,
    ConvertApiIntoPlantData,
    ConvertPlantDataIntoApi,
    PlantData,
    PlantDataApi,
    ValidPlantData
} from "@/modules/plant_data";
import axios from "axios";

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

    // Connect to the database
    const client = await db.connect();

    // Get the ID and table from the query string
    const { operation, json, id } = request.query;


    // Try downloading the data from the database
    try {

        switch (operation) {
            case 'download':
                // If the ID is not found, return an error
                if(!id){
                    return response.status(404).json({ error: 'ID parameter not found' });
                }

                // If the ID is not a number, return an error
                if(isNaN(Number(id))){
                    return response.status(404).json({ error: 'ID parameter is not a number' });
                }

                // Download the data from the database using the download API with the ID and table
                let plantsInfo = await axios.get(`${url}/api/plants/download?id=${id}&table=plants&table=months_ready_for_use&table=edible&table=medical&table=craft&table=source&table=custom`);
                plantsInfo = plantsInfo.data;

                // If there is no plant data, return an error
                if(plantsInfo.error){
                    return response.status(404).json({ error: plantsInfo.error });
                }

                let apiData = plantsInfo.data as PlantDataApi;

                // Clean the data
                apiData = CleanAPIData(apiData);

                // Convert the data into the PlantData format
                const plantOBJ = ConvertApiIntoPlantData(apiData);

                // If the data is null then return an error
                if(!plantOBJ){
                    return response.status(404).json({ error: 'Plant data count be converted into PlantData', apiData: apiData });
                }

                return response.status(200).json({ data: plantOBJ});

            case 'upload':
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
                const uploadApiData = ConvertPlantDataIntoApi(parsed as PlantData);

                // If the data is null then return an error
                if (!uploadApiData) {
                    return response.status(400).json({ error: "PlantData could not be converted into API format" });
                }

                // Upload the data to the database using the upload API by passing each json key as params
                let result = await axios.post(`${url}/api/plants/upload`, uploadApiData);

                // Return the data
                return response.status(200).json({ data: result.data });

            default:
                // If the operation is not found, return an error
                return response.status(404).json({ error: 'Operation not found' });
        }

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error:  (error as Error).message });
    }

}