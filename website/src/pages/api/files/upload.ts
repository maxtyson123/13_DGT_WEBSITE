import {NextApiRequest, NextApiResponse} from 'next';
import {getClient, PostgresSQL, SQLDatabase} from "@/lib/databse";
import {USE_POSTGRES} from "@/lib/constants";
import {CheckWhitelisted, GetOrigin} from "@/lib/api_tools";
import {Form} from "multiparty";
import fs from "fs";
import Client from "ftp";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";


export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    // Get the origin of the request
    const origin = GetOrigin(request);
    const session = await getServerSession(request, response, authOptions)

    // If the request is not a POST request, return an error
    if(request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed, please use POST' });
    }

    // Get the client
    const client = await getClient()

    // Try uploading the data to the database
    try {

        console.log("API/Upload")
       //console.log(request.body);

        console.log("Uploading file to FTP server")

        try {

            // FTP config
            const ftpConfig = {
                host: process.env.FTP_HOST,
                port: 21,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD,
            };

            // Upload the file to the FTP server
            const form = new Form();

            // Parse the form
            form.parse(request, async (err, fields, files) => {

                const { id, api_key } = fields;

                // Check if id is null
                if(!id){
                    return response.status(400).json({ error: 'No ID' });
                }

                // Check if the data is being downloaded from the Postgres database
                let tables = new SQLDatabase();

                // Set the tables to use
                if(USE_POSTGRES) {
                    tables = new PostgresSQL();
                }

                // Check if the user is allowed to upload
                if(!await CheckWhitelisted(request, response, client)) {
                    return response.status(401).json({ error: 'User not authorised to upload' });
                }

                // Check if there is an error
                if (err) {
                    return response.status(500).json({ error: 'Error parsing form data.', data: err });
                }

                // Get the file
                const { file } = files;

                // Check if there is a file
                if (!file) {
                    return response.status(400).json({ error: 'No file provided.' });
                }

                // Connect to the FTP server
                const ftp = new Client();
                ftp.on('ready', () => {

                    // Get the path to upload to
                    const folder = `/plants/${id}`
                    const remotePath = `${folder}/${file[0].originalFilename}`
                    console.log(remotePath)


                    const directories = folder.split('/').filter(Boolean);
                    let currentDir = '';

                    console.log("Creating directories")
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


                    // Upload the file
                    ftp.put(file[0].path, remotePath, (ftpErr) => {

                        // Once done end the connection
                        ftp.end();

                        // If there is an error return it
                        if (ftpErr) {
                            console.log(ftpErr)
                            return response.status(500).json({ error: 'Error uploading file.', data: ftpErr });
                        }

                        // Delete the file locally
                        fs.unlinkSync(file[0].path);

                        // Return that the file was uploaded
                        return response.status(200).json({ message: 'File uploaded successfully.', path: remotePath });
                    });
                });

                // If there is an error return it
                ftp.on('error', (ftpErr) => {
                    return response.status(500).json({ error: 'FTP connection error.' });
                });

                // Initiate the connection
                ftp.connect(ftpConfig);
            });
        }
        catch(err) {
            console.log(err)
            return response.status(500).json({message: "ERROR IN SERVER", error: err });
        }
    } catch (error) {
        // If there is an error, return the error
        console.log("ERROR")
        console.log(error)
        return response.status(500).json({message: "ERROR IN SERVER", error: error });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
