import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import NextAuth, {NextAuthOptions} from "next-auth";
import {getClient, getTables, makeQuery} from "@/lib/databse";
import {MEMBER_USER_TYPE} from "@/lib/users";

/**
 * The config options that NextAuth uses when authenticating users
 */
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ? process.env.GOOGLE_ID : '',
            clientSecret: process.env.GOOGLE_SECRET ? process.env.GOOGLE_SECRET : '',
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID ? process.env.GITHUB_ID : '',
            clientSecret: process.env.GITHUB_SECRET ? process.env.GITHUB_SECRET : '',
        })
    ],
    callbacks: {
        async jwt({ token}) {

            // If there isnt the user data in the token the fetch it
            if(!token.user) {

                // Get the tables and client
                const tables = getTables();
                const client = await getClient()

                // Make the query
                let query = `SELECT * FROM users WHERE ${tables.user_email} = '${token.email}' AND ${tables.user_name} = '${token.name}'`;
                console.log(query);
                const user = await makeQuery(query, client)

                if(user.length != 0) {
                    // Add the user to the token
                    token.user = user[0];
                }else{
                    // Add the user to the token
                    token.user = {};
                }
            }

            return token
        },
        async signIn({ user, account, profile, email, credentials }) {

            console.log("Sign in");

            // Get the client
            const client = await getClient()

            // Get the tables
            const tables = getTables();

            // Try uploading the data to the database
            try {

                // Get the user details
                const user_email = user?.email;
                const user_name = user?.name;
                const user_image = user?.image;
                const user_type = MEMBER_USER_TYPE;

                // Check if there already is a user
                let query = `SELECT * FROM users WHERE ${tables.user_email} = '${user_email}' AND ${tables.user_name} = '${user_name}'`;
                console.log(query);
                const existing_user = await makeQuery(query, client)
                if(existing_user.length > 0) {
                    // Update the users login time and image
                    query = `UPDATE users SET ${tables.user_last_login} = NOW(), ${tables.user_image} = '${user_image}' WHERE ${tables.user_email} = '${user_email}' AND ${tables.user_name} = '${user_name}'`;
                    console.log(query);
                    await makeQuery(query, client)

                    return true
                }

                // Insert the user into the database
                query = `INSERT INTO users (${tables.user_email}, ${tables.user_name}, ${tables.user_type}, ${tables.user_last_login}, ${tables.user_image} ) VALUES ('${user_email}', '${user_name}', '${user_type}', NOW(), '${user_image}')`;
                const new_user = await makeQuery(query, client)

                // Return that it was completed
                return true

            } catch (error) {
                console.log("Error");
                console.log(error);

                // If there is an error, return the error
                return false
            }
        },
        async session({ session, token, user }) {

            //@ts-ignore
            session.user.database = token.user;

            return session
        }
    },
}

export default NextAuth(authOptions)