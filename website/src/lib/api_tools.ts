import {NextApiRequest} from "next";

export function GetOrgin(request: NextApiRequest){
    const LOCAL_HOST_ADDRESS = "localhost:3000";

    let host = request.headers?.host || LOCAL_HOST_ADDRESS;
    let protocol = /^localhost(:\d+)?$/.test(host) ? "http:" : "https:";

    // If server sits behind reverse proxy/load balancer, get the "actual" host ...
    if (
        request.headers["x-forwarded-host"] &&
        typeof request.headers["x-forwarded-host"] === "string"
    ) {
        host = request.headers["x-forwarded-host"];
    }

    // ... and protocol:
    if (
        request.headers["x-forwarded-proto"] &&
        typeof request.headers["x-forwarded-proto"] === "string"
    ) {
        protocol = `${request.headers["x-forwarded-proto"]}:`;
    }

    return protocol + "//" + host;
}