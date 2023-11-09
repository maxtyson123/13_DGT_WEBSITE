import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {GetOrigin} from "@/lib/api_tools";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {RongoaUser} from "@/lib/users";

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

    // Get the id
    const { id } = request.query;


    try {

        let query = `SELECT * FROM users WHERE id = ${id}`;

        // If there is no id then must be using the user session
        if(!id) {


            // Get the session
            const session = await getServerSession(request, response, authOptions)

            // If there is no session then return an error
            if (!session || !session.user) {
                return response.status(401).json({error: 'User not logged in'});
            }

            // Get the user details
            const user = session.user as RongoaUser;
            const user_email = user.database.user_email;
            const user_name = user.database.user_name;

            // Fetch the user
            query = `SELECT * FROM users WHERE ${tables.user_email} = '${user_email}' AND ${tables.user_name} = '${user_name}'`;

        }
        console.log(query);
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