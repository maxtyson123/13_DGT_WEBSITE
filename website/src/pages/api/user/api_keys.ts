import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables} from "@/lib/databse";
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
        const user_email = session.user.email;
        const user_name = session.user.name;

        // Get the operation
        const { operation } = request.query;
        if(!operation) {
            return response.status(400).json({ error: 'No operation specified'});
        }

        switch (operation) {

            case "new":
                break

            case "remove":
                break

            case "edit":
                break

        }



    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}