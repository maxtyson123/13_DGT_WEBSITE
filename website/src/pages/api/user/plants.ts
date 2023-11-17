import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {RongoaUser} from "@/lib/users";
import {checkApiPermissions} from "@/lib/api_tools";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the origin of the request
    

    // Get the client
    const client = await getClient()

    // Get the tables
    const tables = getTables();

    // Get the user id from the request
    const { id } = request.query

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:plants:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    const handleGet = async (userID: string) => {
        // Fetch the plants
        let query = `SELECT id, ${tables.preferred_name}, ${tables.english_name}, ${tables.maori_name}, ${tables.latin_name}, ${tables.last_modified}, ${tables.plant_type} FROM plants WHERE ${tables.author} LIKE '%,${userID},%' OR ${tables.author} LIKE '${userID},%' OR ${tables.author} LIKE '%,${userID}' OR ${tables.author} LIKE '${userID}'`;
        console.log(query);
        const plants = await makeQuery(query, client)

        if (plants.length == 0) {
            return response.status(400).json({error: 'User doesnt have any plants'});
        }

        // Return the user
        return response.status(200).json({data: plants});
    }

    try {

        // If there is an id then return the user with that id
        if(id) {

            return handleGet(id as string)

        }

        // Get the session
        const session = await getServerSession(request, response, authOptions)

        // If there is no session then return an error
        if(!session || !session.user) {
            return response.status(401).json({ error: 'User not logged in'});
        }

        // Get the user details
        const user_id = (session.user as RongoaUser).database.id

        return handleGet(user_id.toString())


    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}