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

    // Get the email
    const { email } = request.query;

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, "api:user:email:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    try {

        // Check if the email is null
        if(!email){
            return response.status(400).json({ error: 'No email' });
        }

        let query = `SELECT ${tables.user_email} FROM users WHERE ${tables.user_email} = '${email}'`;

        const user = await makeQuery(query, client)

        if(!user || user.length == 0) {
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