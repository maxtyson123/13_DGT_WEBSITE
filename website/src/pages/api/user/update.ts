import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';

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
    const { id,
        name,
        email,
        image,
        adminData
    } = request.query;

    // If there is a missing variable then return an error
    if(!adminData)
        if(!id || !name || !email) {
            return response.status(400).json({ error: 'Missing variables, must have id, name and email', id, name, email });
        }

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:update:access")
    const adminPermission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:update:admin")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    try {

        let imageQuery = "";
        if(image) {
            imageQuery = `, ${tables.user_image} = '${image}'`;
        }

        let query = `UPDATE users SET ${tables.user_name} = '${name}', ${tables.user_email} = '${email}' ${imageQuery} WHERE id = ${id}`;


        // If it is an admin update then add the admin data
        if(adminData) {

            // If not an admin then return an error
            if(!adminPermission) {
                return response.status(401).json({error: "Not Authorized"})
            }

            let data = JSON.parse(adminData as any);
            query = `UPDATE users SET ${tables.user_name} = '${data.name}', ${tables.user_email} = '${data.email}', ${tables.user_type} = '${data.user_type}' WHERE id = ${data.id}`;
        }

        console.log("====================================");
        console.log(query);
        console.log("====================================");
        const user = await makeQuery(query, client)

        if(user.length == 0) {
            return response.status(400).json({ error: 'User doesnt exists'});
        }

        // Log the update
        logger.info(`User ${id} updated`);

        // Return the user
        return response.status(200).json({ user: user[0] });


    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}