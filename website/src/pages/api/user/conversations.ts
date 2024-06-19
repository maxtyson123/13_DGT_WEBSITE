import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';
import {MEMBER_USER_TYPE, RongoaUser} from "@/lib/users";
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
        recipientID,
        channelID,
        message,

    } = request.query;


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
                                c.conversation_user_two,
                                m.id AS message_id,
                                m.message_user_id,
                                m.message_text,
                                m.message_date
                            FROM
                                conversations c
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

                query = `SELECT * FROM messages WHERE message_conversation_id = ${channelID};`

                break

            case "update":

                query = `INSERT INTO messages (message_conversation_id, message_user_id, message_text, message_date) VALUES (${channelID}, ${userID}, ${message}, NOW());`

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