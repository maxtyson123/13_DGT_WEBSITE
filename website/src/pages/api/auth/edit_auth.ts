import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {


    return response.status(200).json({ data: "Under Development" });



    // Get the client
    const client = await getClient()

    // Get the tables
    const tables = getTables();

    // Try uploading the data to the database
    try {


        // Get the data from the request
        let {
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

        // Check if the entry is valid
        if(operation != "fetch")
        if(!entry || !type || !nickname || !permissions){
            return response.status(400).json({ error: 'Missing entry, type, nickname or permissions', entry: entry, type: type, nickname: nickname, permissions: permissions});
        }

        // Convert entry to string
        if(entry)
            entry = Buffer.from(entry as string, 'base64').toString('ascii');

        let query = "";
        switch (operation) {
            case "add":
                // Make the query
                query = `INSERT INTO auth (${tables.auth_entry}, ${tables.auth_type}, ${tables.auth_nickname}, ${tables.auth_permissions}) VALUES ('${entry}', '${type}', '${nickname}', '${permissions}')`;
                const new_auths = await makeQuery(query, client)
                return response.status(200).json({ data: new_auths });

            case "remove":
                // Make the query
                query = `DELETE FROM auth WHERE ${tables.auth_entry} = '${entry}' AND ${tables.auth_type} = '${type}' AND ${tables.auth_nickname} = '${nickname}' AND ${tables.auth_permissions} = '${permissions}'`;
                console.log(query)
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