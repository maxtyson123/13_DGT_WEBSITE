import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {checkApiPermissions} from "@/lib/api_tools";
import { Logger } from 'next-axiom';
import {MEMBER_USER_TYPE, RongoaUser} from "@/lib/users";
import crypto from 'crypto';
import Client from "ftp";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the logger
    const logger = new Logger()

    // Get the client
    const client =  await getClient()

    // Check if the user is permitted to access the API
    const session = await getServerSession(request, response, authOptions)
    let permission = await checkApiPermissions(request, response, session, client, makeQuery, "api:posts:move:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    // If there is no session then return an error
    if(!session || !session.user) {
        return response.status(401).json({ error: 'User not logged in'});
    }

    // Get the user details
    const user = session.user as RongoaUser;
    const user_id = user.database.id;
    const user_is_member = user.database.user_type === MEMBER_USER_TYPE;

    // Try uploading the data to the database
    try {
        let {
            id,
        } = request.query;


        let ids: string[] = [];

        // If no id is provided, return an error
        if(!id) {
            return response.status(400).json({error: "No ID provided"});
        }

        // If ids is an array, set it to the array
        if(Array.isArray(id)) {
            ids = id;
        } else {
            ids.push(id);
        }

        // Check if the data is being downloaded from the Postgres database
        const tables = getTables()

        // FTP config
        const ftpConfig = {
            host: process.env.FTP_HOST,
            port: 21,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
        };

        const ftp = new Client();
        ftp.on('ready', async () => {

            // Update the posts in_use status
            let query = "";
            for (let i = 0; i < ids.length; i++) {

                const postId = ids[i];

                // Fetch the existing post data from the database
                const postQuery = `SELECT * FROM posts WHERE id = ${postId};`;
                const postResult = await makeQuery(postQuery, client);

                // Since postResult is an array, get the first element
                const postData = postResult[0];

                if (!postData) {
                    return response.status(404).json({error: "Post not found"});
                }

                // Check if already in use
                if(postData.post_in_use) {
                    return response.status(400).json({error: "Post already in use"});
                }

                const {post_image, post_user_id, post_plant_id, post_title, post_date} = postData;
                const originalFilePath = `/users/${post_user_id}/posts/${postId}/${post_image}`.replaceAll("’","'");

                // Generate a random string for the new image name
                const newImageRand = crypto.randomBytes(4).toString("hex");
                const newImageName = `${post_title}_${new Date(post_date).toDateString().replaceAll(" ", "_")}_${newImageRand}.${post_image.split('.').pop()}`
                const newFilePath = `/plants/${post_plant_id}/${newImageName}`;

                console.log(`Moving image from ${originalFilePath} to ${newFilePath}`);




                // Move the file on the FTP server
                await new Promise((resolve, reject) => {

                    // Create the directories
                    const directories = newFilePath.split('/').slice(1, -1);
                    let currentDir = '';
                    directories.forEach((directory) => {
                        currentDir += `/${directory}`;
                        ftp.mkdir(currentDir, (ftpErr) => {
                            if (ftpErr && (ftpErr as any).code !== 550) {
                                // 550 error code means the directory already exists,
                                // so ignore it and continue creating subdirectories
                                return response.status(500).json({ error: 'Error creating directory.' });
                            }
                        });
                    });

                    // Move the file
                    ftp.rename(originalFilePath, newFilePath, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(null);
                        }
                    });
                });

                // Update the database with the new image path
                const updateQuery = `UPDATE posts SET post_image = '${newImageName}', post_in_use = true WHERE id = ${postId};`;
                await makeQuery(updateQuery, client);

                // Log the move
                logger.info(`Post ${postId} image moved by ${session?.user?.email}`);
                console.log(`Post ${postId} image moved by ${session?.user?.email}`);
            }
        });

        // If there is an error return it
        ftp.on('error', (ftpErr) => {
            return response.status(500).json({ error: 'FTP connection error.' });
        });

        // Initiate the connection
        ftp.connect(ftpConfig);


        return response.status(200).json({ message: "Upload Successful", id: id });
    } catch (error) {
        console.error(error);
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    } finally {

        if(USE_POSTGRES)
            await client.end();

    }
}

