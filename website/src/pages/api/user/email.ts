import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {GetOrigin} from "@/lib/api_tools";

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

    // Get the email
    const { email } = request.query;


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