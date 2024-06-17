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
    let {
        operation,
        user_ids,
        message_ids,
        title,
        body,
        image,
        status,
    } = request.query;


    // Check if the user is permitted to access the API
    // const session = await getServerSession(request, response, authOptions)
    // const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:new:access")
    // if(!permission) return response.status(401).json({error: "Not Authorized"})

    let axiosConfig;

    try {

        switch (operation) {
            case "send_notification":

                if(!user_ids || !title || !body )
                    return response.status(400).json({ error: 'Missing variables, must have user_ids, title and body', user_ids, title, body });



                // Make user_ids an array if it is not
                if(!Array.isArray(user_ids))
                    user_ids = [user_ids];

                axiosConfig = {
                    method: 'post',
                    url: 'https://api.knock.app/v1/workflows/test/trigger',
                    data: {
                        recipients: user_ids,
                        data: {
                            title: title,
                            body: body,
                            image: image ? image : "https://rongoa.maxtyson.net/media/images/logo.svg"
                        }
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.KNOCK_API_KEY_SECRET}`
                    }
                };

                break;

            case "update_status":
                if(!user_ids || !message_ids)
                    return response.status(400).json({ error: 'Missing variables, must have user_ids and message_ids', user_ids, message_ids });

                // Make user_ids an array if it is not
                if(!Array.isArray(user_ids))
                    user_ids = [user_ids];

                // Make message_ids an array if it is not
                if(!Array.isArray(message_ids))
                    message_ids = [message_ids];

                axiosConfig = {
                    method: 'post',
                    url: 'https://api.knock.app/v1/workflows/test/trigger',
                    data: {
                        recipients: user_ids,
                        data: {
                            title: title,
                            body: body,
                            image: image ? image : "https://rongoa.maxtyson.net/media/images/logo.svg"
                        }
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.KNOCK_API_KEY_SECRET}`
                    }
                };

                break;


            default:
                return response.status(400).json({ error: 'Invalid operation', operation });
        }

        const d = await axios.request(axiosConfig);
        console.log(d.data);

        return response.status(200).json({ data: d.data });





    } catch (error) {

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}