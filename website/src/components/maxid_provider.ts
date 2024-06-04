export interface MaxIDProfile extends Record<string, any> {
    object: string
    instance_id: string
    email: string
    email_verified: boolean
    family_name: string
    given_name: string
    name: string
    username: string
    picture: string
    user_id: string
    public_metadata: Record<string, any>
    private_metadata: Record<string, any>
    unsafe_metadata: Record<string, any>
}

export default function MaxID<P extends MaxIDProfile>(
    options: any
): any {
    return {
        id: "maxid",
        name: "Max ID",
        type: "oauth",
        authorization: {
            url: process.env.MAXID_DOMAIN + "/oauth/authorize",
            params: { scope: "email profile" },
        },
        token: process.env.MAXID_DOMAIN + "/oauth/token",
        userinfo: process.env.MAXID_DOMAIN + "/oauth/userinfo",
        profile(profile: any) {
            return {
                id: profile.user_id,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
            }
        },
        style: { logo: "https://rongoa.maxtyson.net/media/images/maxid.svg", bg: "#2f2c2c", text: "#fff" },
        options,
    }
}