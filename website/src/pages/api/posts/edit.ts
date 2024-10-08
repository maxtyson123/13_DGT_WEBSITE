import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';
import {MEMBER_USER_TYPE, RongoaUser} from "@/lib/users";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the client
    const client =  await getClient()

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:posts:edit:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})


    // Try uploading the data to the database
    try {
        let {
            id,
            post_title,
            post_plant_id,
            post_description,

        } = request.query;


        // Check if the data is being downloaded from the Postgres database
        const tables = getTables()
        let query = ""

        // Edit the post
        query = `UPDATE posts SET ${tables.post_title} = '${post_title}', ${tables.post_approved} = true, ${tables.post_plant_id} = ${post_plant_id}, ${tables.post_description} = '${post_description}' WHERE ${tables.id} = ${id};`;

        // Run the query
        const data = await makeQuery(query, client)

        return response.status(200).json({message: "Success", data: data});

    } catch (error) {
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    } finally {

        if(USE_POSTGRES)
            await client.end();

    }
}

