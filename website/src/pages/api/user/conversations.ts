import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';
import {MEMBER_USER_TYPE, RongoaUser} from "@/lib/users";
import axios from "axios";
import {USE_POSTGRES} from "@/lib/constants";

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
        recipientID,
        channelID,
        message,

    } = request.query;

    const timeFunction = USE_POSTGRES ? "to_timestamp" : "FROM_UNIXTIME";

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const userID = (session?.user as RongoaUser).database.id
    // const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:new:access")
    // if(!permission) return response.status(401).json({error: "Not Authorized"})

    let query;

    try {

        switch (operation) {

            case "list":

                query = `
                          SELECT
                            c.id AS conversation_id,
                            c.conversation_user_one,
                            u1.user_name AS user_one_name,
                            u1.user_image AS user_one_photo,
                            c.conversation_user_two,
                            u2.user_name AS user_two_name,
                            u2.user_image AS user_two_photo,
                            m.id AS message_id,
                            m.message_user_id,
                            m.message_text,
                            m.message_date
                        FROM
                            conversations c
                        LEFT JOIN
                            users u1 ON c.conversation_user_one = u1.id
                        LEFT JOIN
                            users u2 ON c.conversation_user_two = u2.id
                        LEFT JOIN
                            (SELECT
                                 m1.message_conversation_id,
                                 m1.id,
                                 m1.message_user_id,
                                 m1.message_text,
                                 m1.message_date
                             FROM
                                 messages m1
                             INNER JOIN
                                 (SELECT
                                      message_conversation_id,
                                      MAX(message_date) AS latest_message_date
                                  FROM
                                      messages
                                  GROUP BY
                                      message_conversation_id
                                 ) lm ON m1.message_conversation_id = lm.message_conversation_id
                                 AND m1.message_date = lm.latest_message_date
                             ) m ON c.id = m.message_conversation_id
                        WHERE
                            c.conversation_user_one = ${userID} OR c.conversation_user_two = ${userID};
                `
                console.log(query)

                break

            case "new":

                query = `INSERT INTO conversations (conversation_user_one, conversation_user_two) VALUES (${userID}, ${recipientID});`

                break

            case "get":

                // Make sure there is a user id and a channel id
                if(!userID || !channelID) return response.status(400).json({error: "Missing user ID or channel ID"})

                query = `
                       SELECT
                            m.*,
                            u1.user_name AS user_one_name,
                            u1.user_image AS user_one_image,
                            u2.user_name AS user_two_name,
                            u2.user_image AS user_two_image
                        FROM
                            conversations c
                        LEFT JOIN
                            messages m ON m.message_conversation_id = c.id
                        INNER JOIN
                            users u1 ON c.conversation_user_one = u1.id
                        INNER JOIN
                            users u2 ON c.conversation_user_two = u2.id
                        WHERE
                            c.id = ${channelID} AND (c.conversation_user_one = ${userID} OR c.conversation_user_two = ${userID})
                `;

                break

            case "update":

                // Make sure there is a user id and a channel id
                if(!userID || !channelID || !message) return response.status(400).json({error: "Missing user ID, channel ID, or message"})

                query = `INSERT INTO messages (message_conversation_id, message_user_id, message_text, message_date) VALUES (${channelID}, ${userID}, '${message}', NOW());`

                break

            default:
                return response.status(400).json({ error: 'Invalid operation', operation });
        }


        // Run the query
        const data = await makeQuery(query, client, true)
        return response.status(200).json({ data: data });

    } catch (error) {

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}