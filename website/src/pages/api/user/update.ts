import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
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

    // Get the variables
    const { id, name, email, image } = request.query;

    // If there is a missing variable then return an error
    if(!id && !name && !email) {
        return response.status(400).json({ error: 'Missing variables, must have id, name and email', id, name, email });
    }

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:update:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    try {

        let imageQuery = "";
        if(image) {
            imageQuery = `, ${tables.user_image} = '${image}'`;
        }

        let query = `UPDATE users SET ${tables.user_name} = '${name}', ${tables.user_email} = '${email}' ${imageQuery} WHERE id = ${id}`;

        console.log("====================================");
        console.log(query);
        console.log("====================================");
        const user = await makeQuery(query, client)

        if(user.length == 0) {
            return response.status(400).json({ error: 'User doesnt exists'});
        }

        // Return the user
        return response.status(200).json({ user: user[0] });


    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}