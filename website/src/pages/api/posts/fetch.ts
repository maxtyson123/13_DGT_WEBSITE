import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {RongoaUser} from "@/lib/users";
import {checkApiPermissions} from "@/lib/api_tools";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {


    // Get the client
    const client = await getClient()

    // Get the tables
    const tables = getTables();

    // Get the id
    const {
        id,
        operation,
        min,
        following,
        page ,
        plant_id
    } = request.query;


    let uid;

    if(operation != "siteFeed"){

        // Check if the user is permitted to access the API
        const session = await getServerSession(request, response, authOptions)
        const permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:user:data:access")
        if(!permission) return response.status(401).json({error: "Not Authorized"})

        // Get the user id
        const user = session?.user as RongoaUser;
        uid = user.database.id;                // Get the user id
    }




    try {

        // Check if there is a operation
        if(!operation) {
            return response.status(400).json({ error: 'No operation provided'});
        }

        let query = '';

        let amountPerPage = 3

        switch (operation) {

            case "siteFeed":


                amountPerPage = 8

                const specificQuery = plant_id ? ` AND ${tables.post_plant_id} = ${plant_id}` : ""

                // Get the latest posts
                query = `SELECT * FROM posts WHERE ${tables.post_approved} = 1 ${specificQuery} ORDER BY ${tables.post_date} DESC`;


                break;


            case "list":
                // Check if there is no user id
                if(!id) {
                    return response.status(400).json({ error: 'No id provided'});
                }

                if (min) {
                    query = `SELECT id, ${tables.post_image} FROM posts WHERE ${tables.post_user_id} =`;
                } else {
                    query = `SELECT * FROM posts WHERE ${tables.post_user_id} =`;
                }

                query += ` ${id}`;

                break;

            case "data":
                // Check if there is no user id
                if(!id) {
                    return response.status(400).json({ error: 'No id provided'});
                }

                let idQuery = ` = ${id}`

                // Check if id is an array
                if(Array.isArray(id))
                    idQuery =  ` IN (${id.join(",")})`

                // Get post data, likes count and whether the current user has liked the post
                query = `SELECT posts.*, 
                         (SELECT COUNT(*) FROM likes WHERE likes.${tables.like_post_id} = posts.id) as like_count,
                         (SELECT COUNT(*) FROM likes WHERE likes.${tables.like_post_id} = posts.id AND likes.${tables.like_user_id} = ${uid}) > 0 as user_liked
                         FROM posts WHERE id` + idQuery;
                break;

            case "generalFeed":

                // If not following anyone select the latest posts from everyone
                if(following == "none") {
                    query = `SELECT posts.*, 
                             (SELECT COUNT(*) FROM likes WHERE likes.${tables.like_post_id} = posts.id) as like_count,
                             (SELECT COUNT(*) FROM likes WHERE likes.${tables.like_post_id} = posts.id AND likes.${tables.like_user_id} = ${uid}) > 0 as user_liked
                             FROM posts WHERE ${tables.post_user_id} != ${id} ORDER BY ${tables.post_date} DESC`;
                    break;
                }

                // Make sure following is an array
                if(!following &&  !Array.isArray(following)) {
                    console.log(following)
                    return response.status(400).json({ error: 'No following provided'});
                }

                let following_array = [];

                // Check if it is a array
                if(Array.isArray(following)) {
                    following_array = following as string[];
                } else {
                    following_array = [following];
                }

                // Make sure we know the user id
                if(!id) {
                    return response.status(400).json({ error: 'No id provided'});
                }

                // Select the latest posts from followers, but make sure the user's posts are not shown
                query = `SELECT posts.*, 
                         (SELECT COUNT(*) FROM likes WHERE likes.${tables.like_post_id} = posts.id) as like_count,
                         (SELECT COUNT(*) FROM likes WHERE likes.${tables.like_post_id} = posts.id AND likes.${tables.like_user_id} = ${uid}) > 0 as user_liked
                         FROM posts WHERE ${tables.post_user_id} IN (${following_array.join(",")}) AND ${tables.post_user_id} != ${id}`;

                // Now select everything else (but still not the user's posts)
                query += ` UNION SELECT posts.*, 
                       (SELECT COUNT(*) FROM likes WHERE likes.${tables.like_post_id} = posts.id) as like_count,
                       (SELECT COUNT(*) FROM likes WHERE likes.${tables.like_post_id} = posts.id AND likes.${tables.like_user_id} = ${uid}) > 0 as user_liked
                       FROM posts WHERE ${tables.post_user_id} NOT IN (${following_array.join(",")}) AND ${tables.post_user_id} != ${id} ORDER BY ${tables.post_date} DESC`;

                break;

            default:
                return response.status(400).json({error: 'Invalid operation'});

        }

        // If the user specified a page, get the correct page
        if (page) {

            let currentPage = parseInt(page as string)
            query += ` LIMIT ${amountPerPage} OFFSET ${(currentPage - 1) * amountPerPage}`
        }

        const user = await makeQuery(query, client)

        if(!user) {
            return response.status(400).json({ error: 'No Data Found'});
        }

        // Return the user
        return response.status(200).json({ data: user});


    } catch (error) {

        // If there is an error, return the error
        console.log(error)
        return response.status(500).json({ error: error });
    }
}