import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import NextAuth, {NextAuthOptions} from "next-auth";

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
        async jwt({ token }) {
            return token
        },
    },
}

export default NextAuth(authOptions)