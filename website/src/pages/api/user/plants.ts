import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {GetOrigin} from "@/lib/api_tools";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the origin of the request
    const origin = GetOrigin(request);

    // Get the client
    const client = await getClient()

    // Get the tables
    const tables = getTables();

    try {

        // Get the session
        const session = await getServerSession(request, response, authOptions)

        // If there is no session then return an error
        if(!session || !session.user) {
            return response.status(401).json({ error: 'User not logged in'});
        }

        // Get the user details
        // @ts-ignore
        const user_id = session.user.database.id

        // Fetch the plants
        let query = `SELECT id, ${tables.preferred_name}, ${tables.english_name}, ${tables.maori_name}, ${tables.latin_name}, ${tables.last_modified}, ${tables.plant_type} FROM plants WHERE ${tables.author} LIKE '%,${user_id},%' OR ${tables.author} LIKE '${user_id},%' OR ${tables.author} LIKE '%,${user_id}' OR ${tables.author} LIKE '${user_id}'`;
        console.log(query);
        const plants = await makeQuery(query, client)

        if(plants.length == 0) {
            return response.status(400).json({ error: 'User doesnt have any plants'});
        }

        // Return the user
        return response.status(200).json({ data: plants });


    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}