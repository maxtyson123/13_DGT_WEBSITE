import {NextApiRequest, NextApiResponse} from 'next';
import {getClient} from "@/lib/databse";
import {checkApiPermissions} from "@/lib/api_tools";
import archiver from 'archiver';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import Client from "ftp";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

async function fetchFileUrlsFromFTP() {
    // FTP config
    const ftpConfig = {
        host: process.env.FTP_HOST,
        port: 21,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
    };

    return new Promise((resolve, reject) => {

        // Get the file urls
        const fileUrls: string[] = [];
        const ftp = new Client();

        // Connect to the FTP server
        ftp.on('ready', () => {

            // Get the list of files
            ftp.list('/plants', (err, list) => {

                // If there is an error, reject the promise
                if (err) {
                    reject(err);
                    ftp.end();
                    return;
                }

                // Create a promise for each subdirectory
                const subDirectoryPromises = list.map(subDir => {
                    return new Promise<void>((resolveSubDir, rejectSubDir) => {

                        // If the sub dir is . or .., skip it
                        if (subDir.name === '.' || subDir.name === '..')
                            return resolveSubDir();

                        // Get the list of files in the subdirectory
                        ftp.list(`/plants/${subDir.name}`, (subErr, fileList) => {

                            // If there is an error, reject the promise
                            if (subErr) {
                                rejectSubDir(subErr);
                                return;
                            }

                            // Add each file to the list of file urls
                            for (const file of fileList) {

                                // If the file is . or .., skip it
                                if (file.name == '.' || file.name == '..')
                                    continue

                                // Get the file url
                                const fileUrl = `${process.env.NEXT_PUBLIC_FTP_PUBLIC_URL}/plants/${subDir.name}/${file.name}`;

                                // Add the file url to the list
                                fileUrls.push(fileUrl);
                                console.log(fileUrl);
                            }

                            // Resolve the promise
                            resolveSubDir();
                        });
                    });
                });

                // Once all the subdirectories have been processed, end the connection
                Promise.all(subDirectoryPromises)
                    .then(() => {
                        ftp.end();
                        resolve(fileUrls);
                    })
                    .catch(error => {
                        ftp.end();
                        reject(error);
                    });
            });
        });

        ftp.connect(ftpConfig);
    });
}

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {


    // Get the client
    const client = await getClient()


    // Check if the user has the correct permissions
    const session = await getServerSession(request, response, authOptions)
    const permission = await checkApiPermissions(request, response, session, client, "api:files:backup_files:access")
    if(!permission) return response.status(401).json({error: "Not Authorized"})

    // Try uploading the data to the database
    try {

        // Get the file urls
        const fileUrls = await fetchFileUrlsFromFTP();

        // Create the zip file with the date
        const zipFilePath = path.join(__dirname, `data-${new Date().toISOString().slice(0, 10)}.zip`);

        // Create the zip file
        const archive = archiver('zip', { zlib: { level: 9 } });
        const output = fs.createWriteStream(zipFilePath);

        // Pipe the archive to the output
        archive.pipe(output);

        // @ts-ignore
        for (const fileURL of fileUrls) {
            const fileStream = await fetch(fileURL);
            const fileName = path.basename(fileURL);
            const relativeFilePath = fileURL.replace(process.env.NEXT_PUBLIC_FTP_PUBLIC_URL, '');
            // @ts-ignore
            archive.append(fileStream.body, { name: relativeFilePath }); // Use the relative path as the name
            console.log(`Added ${relativeFilePath}`)
        }

        // Finalise the archive
        await archive.finalize();

        // Send the zip file
        response.setHeader('Content-Disposition', `attachment; data.zip`);
        response.setHeader('Content-Type', 'application/zip');
        fs.createReadStream(zipFilePath).pipe(response);

    } catch (error) {
        console.log("Error");
        console.log(error);

        // If there is an error, return the error
        return response.status(500).json({ error: error });
    }
}
export const config = {
    api: {
        responseLimit: false,
    },
}