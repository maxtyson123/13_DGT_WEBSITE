import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import {RongoaUser} from "@/lib/users";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the client
    const client = await getClient()

    // Get the tables
    const tables = getTables();

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    let permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:api_keys:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    let query = ''

    const { id, publicUserID } = request.query;

    try {

        // Get the session
        const session = await getServerSession(request, response, authOptions)

        // If there is no session then return an error
        if(!session || !session.user) {
            return response.status(401).json({ error: 'User not logged in'});
        }

        // Get the user details
        const user = session.user as RongoaUser;
        const userId = user.database.id;

        // Get the operation
        const { operation, keyName,  permissions} = request.query;
        if(!operation) {
            return response.status(400).json({ error: 'No operation specified'});
        }

        const privateData = await checkApiPermissions(request, response, session, client, makeQuery, "data:account:viewPrivateDetails")

        switch (operation) {

            case "new":

                // Check if the user has permission to add a key
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:api_keys:add")
                if(!permission) return response.status(401).json({error: "Not Authorized"})

                // Check if the key name and permissions are set
                if(!keyName || !permissions) return response.status(400).json({ error: 'Missing parameters'});

                // Generate the missing parameters
                let key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                let logs = [{time: Date.now(), action: "Created"}]

                // Insert the key
                query = `INSERT INTO apikey (${tables.user_id}, ${tables.api_key_name}, ${tables.api_key_value}, ${tables.api_key_permissions}, ${tables.api_key_logs}, ${tables.api_key_last_used} ) VALUES ('${userId}', '${keyName}', '${key}', '${permissions}', '${JSON.stringify(logs)}', NOW())`;
                const inserted = await makeQuery(query, client);

                // Return the key
                return response.status(200).json({ data: { key: key }});

            case "remove":
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:api_keys:remove")
                if(!permission) return response.status(401).json({error: "Not Authorized"})
                break

            case "edit":
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:api_keys:edit")
                if(!permission) return response.status(401).json({error: "Not Authorized"})
                break

            case "fetch":
                permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:api_keys:fetch")
                if(!permission) return response.status(401).json({error: "Not Authorized"})


                if(publicUserID && privateData){
                    query = `SELECT * FROM apikey WHERE ${tables.user_id} = '${publicUserID}'`;
                }else{
                    query = `SELECT * FROM apikey WHERE ${tables.user_id} = '${userId}'`;
                }

                console.log(query);
                const keys = await makeQuery(query, client)

                // Check if the user has any keys
                if(keys.length === 0) {
                    return response.status(404).json({ error: 'No keys found'});
                }

                // Return the keys
                return response.status(200).json({ data: keys });
        }



    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}