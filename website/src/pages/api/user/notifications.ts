import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';
import {MEMBER_USER_TYPE} from "@/lib/users";
import axios from "axios";
import {MESSAGES_NOTIFICATIONS, NOTIFICATIONS} from "@/lib/constants";

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
        workflow_id,
        message,
        conversation_id
    } = request.query;


    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    let permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:notifications:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    let axiosConfig;

    // Set the workflow_id to the default if it is not set
    if(!workflow_id)
        workflow_id = NOTIFICATIONS;


    try {

        switch (operation) {
            case "send_notification":

                // Check permissions
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:notifications:send")
                if(!permission) return response.status(401).json({error: "Not Authorized"})

                let notificationData = {}
                if(workflow_id === NOTIFICATIONS) {

                    if(!user_ids || !title || !body )
                        return response.status(400).json({ error: 'Missing variables, must have user_ids, title and body', user_ids, title, body });


                    notificationData = {
                        title: title,
                        body: body,
                        image: image ? image : "https://rongoa.maxtyson.net/media/images/logo.svg"
                    }

                }else{

                    if(!message || !user_ids || !conversation_id)
                        return response.status(400).json({ error: 'Missing variables, must have message and user_ids', message, user_ids });

                    notificationData = {
                        message: message,
                        conversation_id: conversation_id
                    }
                }

                // Make user_ids an array if it is not
                if(!Array.isArray(user_ids))
                    user_ids = [user_ids];



                axiosConfig = {
                    method: 'post',
                    url: `https://api.knock.app/v1/workflows/${workflow_id}/trigger`,
                    data: {
                        recipients: user_ids,
                        data: notificationData
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.KNOCK_API_KEY_SECRET}`
                    }
                };

                break;

            case "update_status":
                // Check permissions
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:notifications:update")
                if(!permission) return response.status(401).json({error: "Not Authorized"})

                if(!message_ids)
                    return response.status(400).json({ error: 'Missing variables, must have message_ids', message_ids });

                // Make message_ids an array if it is not
                if(!Array.isArray(message_ids))
                    message_ids = [message_ids];

                axiosConfig = {
                    method: 'post',
                    url: 'https://api.knock.app/v1/messages/batch/' + status,
                    data: {
                        message_ids: message_ids,
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

        return response.status(200).json({ data: d.data});





    } catch (error) {

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}