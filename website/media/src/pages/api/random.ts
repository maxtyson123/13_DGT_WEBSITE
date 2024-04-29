import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    // Make a request using axois to the random api
    const response = await axios.get(process.env.RONGOA_API_URL + "random?amount=4?api_key=" + process.env.RONGOA_API_KEY)

    // Return the data from the random api
    res.status(200).json(response.data);

}
