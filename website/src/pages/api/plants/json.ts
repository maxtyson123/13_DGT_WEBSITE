import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';
import {ConvertApiIntoPlantData, PlantDataApi} from "@/modules/plant_data";

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
    const { id } = request.query;

    // Try downloading the data from the database
    try {

        // If the ID is not found, return an error
        if(!id){
            return response.status(404).json({ error: 'ID parameter not found' });
        }

        // If the ID is not a number, return an error
        if(isNaN(Number(id))){
            return response.status(404).json({ error: 'ID parameter is not a number' });
        }

        // Download the data from the database using the download API with the ID and table
        const plantsInfo = await fetch(`${url}/api/plants/download?id=${id}&table=plants&table=months_ready_for_use&table=edible&table=medical&table=craft&table=source&table=custom
        `).then(response => response.json());

        // If there is no plant data, return an error
        if(plantsInfo.error){
            return response.status(404).json({ error: plantsInfo.error });
        }

        // Define the plant object
        let plantOBJ = ConvertApiIntoPlantData(plantsInfo.data as PlantDataApi);

        return response.status(200).json({ data: plantOBJ});

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error:  (error as Error).message });
    }

}