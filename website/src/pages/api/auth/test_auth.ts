import {NextApiRequest, NextApiResponse} from 'next';
import {getClient} from "@/lib/databse";
import {CheckWhitelisted, GetOrigin} from "@/lib/api_tools";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the origin of the request
    const origin = GetOrigin(request);

    // Get the client
    const client = await getClient()


    // Try uploading the data to the database
    try {

        const permissions = await CheckWhitelisted(request, response, client);

        // Check if the user is allowed
        if(!permissions) {
            return response.status(401).json({ error: 'User not whitelisted'});
        }else{
            return response.status(200).json({ message: 'User whitelisted', permissions: permissions});
        }


    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}