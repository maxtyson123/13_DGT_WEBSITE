import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {CheckWhitelisted, GetOrigin} from "@/lib/api_tools";

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

    // Try uploading the data to the database
    try {
        // Check if the user is allowed
        if(!await CheckWhitelisted(request, response, client)) {
            return response.status(401).json({ error: 'User not allowed to edit the auth data'});
        }

        // Get the data from the request
        const {
           operation,
           entry,
           type,
           nickname,
           permissions
        } = request.query;

        console.log(operation)

        if(!operation){
            return response.status(400).json({ error: 'Missing operation'});
        }
        let query = "";
        switch (operation) {
            case "add":
                // Check if the entry is valid
                if(!entry || !type || !nickname || !permissions){
                    return response.status(400).json({ error: 'Missing entry, type, nickname or permissions'});
                }

                // Make the query
                query = `INSERT INTO auth (${tables.auth_entry}, ${tables.auth_type}, ${tables.auth_nickname}, ${tables.auth_permissions}) VALUES ('${entry}', '${type}', '${nickname}', '${permissions}')`;
                const new_auths = await makeQuery(query, client)
                return response.status(200).json({ data: new_auths });


            case "remove":
                // Check if the entry is valid
                if(!entry || !type || !nickname || !permissions){
                    return response.status(400).json({ error: 'Missing entry, type, nickname or permissions'});
                }

                // Make the query
                query = `DELETE FROM auth WHERE ${tables.auth_entry} = '${entry}' AND ${tables.auth_type} = '${type}' AND ${tables.auth_nickname} = '${nickname}' AND ${tables.auth_permissions} = '${permissions}'`;

                const remove_auths = await makeQuery(query, client)
                return response.status(200).json({ data: remove_auths });

            case "fetch":
                // Make the query
                query = `SELECT * FROM auth`;

                // Get the auth entries
                const auths = await makeQuery(query, client)

                // If there are no auths, return an error
                if (!auths) {
                    return response.status(404).json({ error: 'No auths found' });
                }

                // Return the plant ids
                return response.status(200).json({ data: auths });
        }


    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}