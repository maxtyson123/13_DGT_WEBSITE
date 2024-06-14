import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';
import {MEMBER_USER_TYPE} from "@/lib/users";
import axios from "axios";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the logger
    const logger = new Logger()

    // Get the client
    const client = await getClient()

    // Get the tables
    const tables = getTables();

    // Get the variables


    // Check if the user is permitted to access the API
    // const session = await getServerSession(request, response, authOptions)
    // const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:new:access")
    // if(!permission) return response.status(401).json({error: "Not Authorized"})

    try {


        const axiosConfig = {
            method: 'post',
            url: 'https://api.knock.app/v1/workflows/test/trigger',
            data: {
                recipients: ["10"],
                data: {
                    title: "Test Notification",
                    body: "This is a test notification",
                    image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                }
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.KNOCK_API_KEY_SECRET}`
            }
        };

        const d = await axios.request(axiosConfig);
        console.log(d.data);

        return response.status(200).json({ data: d.data });



    } catch (error) {

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}