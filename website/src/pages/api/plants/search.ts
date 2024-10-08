import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // If the request is not a GET request, return an error
    if(request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed, please use GET' });
    }

    // Get the client
    const client = await getClient()

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:plants:search:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    let userIds = [] as any
    let postIds = [] as any
    let plantIds = [] as any

    // Get the ID and table from the query string
    let {
        amount,
        name,
        getNames,
        mushrooms,
        page,
        getExtras,
        getPlants,
        getUsers,
        getPosts,
        getUnpublished
    } = request.query;


    // Try querying the database
    try {

        const tables = getTables()
        const amountPerPage = 3

        let query = ``;
        if(getPlants !== "false") {

            // Assemble the query

            let selector = "WHERE"

            // If the user specified a name, get the plant id from the plants database
            let shouldGetNames = ``;
            if (getNames) {
                shouldGetNames = `, english_name, maori_name, latin_name, preferred_name`;
            }

            // If the user specified to get extra
            let shouldGetExtras = ``;
            if (getExtras) {
                shouldGetExtras = `, ${tables.plant_type}, ${tables.last_modified}`;
            }

            // Get the plant id from the plants database
            query += ` SELECT id ${shouldGetNames} ${shouldGetExtras} FROM plants`;


            // Select what the user entered
            if (name) {


                //TODO: Find a better way to include these characters
                let replaceChars = ["ā", "ē", "ī", "ō", "ū", "Ā", "Ē", "Ī", "Ō", "Ū", "a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]

                // Replace macrons with wildcard
                for (let i = 0; i < replaceChars.length; i++) {
                    name = (name as string).replaceAll(replaceChars[i], `_`)
                }


                query += ` ${selector} (english_name LIKE '%${name}%' OR maori_name LIKE '%${name}%' OR latin_name LIKE '%${name}%')`;
                selector = "AND";
            }

            // Check wether to get non-published plants
            if (!getUnpublished) {
                query += ` ${selector} ${tables.published} = 1`;
                selector = "AND";
            }

            // Filter mushrooms
            if (!mushrooms){
                mushrooms = "exclude"
            }

            switch (mushrooms) {
                    case "include":
                        break;

                    case "exclude":
                        query += ` ${selector} ${tables.plant_type} NOT LIKE '%Mushroom%'`;
                        break;

                    case "only":
                        query += ` ${selector} ${tables.plant_type} LIKE '%Mushroom%'`;
                        break;

                    default:
                        query += ` ${selector} ${tables.plant_type} NOT LIKE '%Mushroom%'`;
                        break;
                }

            // Only get a certain amount
            if (amount) {
                query += ` LIMIT ${amount}`
            }

            // If the user specified a page, get the correct page
            if (page) {

                let currentPage = parseInt(page as string)


                query += ` LIMIT ${amountPerPage} OFFSET ${(currentPage - 1) * amountPerPage}`
            }

            // Return the plants that match the query
            plantIds = await makeQuery(query, client)


            // If there are no plants, return an error
            if (!plantIds) {
                return response.status(404).json({ error: 'No plants found' });
            }
        }

        if(getUsers){


            query = `SELECT id ${getNames ? `,${tables.user_name}` : ""} FROM users ${name ? `WHERE ${tables.user_name} LIKE '%${name}%'` : ""}`
            console.log("Query: " + query)
            const users = await makeQuery(query, client)
            console.log("Users: " + users)

            // If there are no users, return an error
            if (!users) {
                return response.status(404).json({ error: 'No users found' });
            }

            // Set the user ids
            userIds = users

        }

        if(getPosts){


            // Get the info
            query = `SELECT id FROM posts WHERE ${tables.post_title} LIKE '%${name}%' ORDER BY ${tables.post_date} DESC`
            if(getExtras){
                query = `SELECT id, ${tables.post_title}, ${tables.post_date}, ${tables.post_user_id} FROM posts WHERE ${tables.post_title} LIKE '${name}%' ORDER BY ${tables.post_date} DESC`
            }



            const posts = await makeQuery(query, client)

            // If there are no posts, return an error
            if (!posts) {
                return response.status(404).json({ error: 'No posts found' });
            }

            // Set the post ids
            postIds = posts
        }



        // Return the plant ids // TODO: deprecate the data part
        return response.status(200).json( { data: plantIds, plants: plantIds, users: userIds, posts: postIds});

    } catch (error) {
        // If there is an error, return the error
        return response.status(500).json({ error:  (error as Error).message });
    }

}