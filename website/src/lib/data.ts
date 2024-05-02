import {RongoaUser} from "@/lib/users";

export function addMeasureSuffix(value: number): string {

    if(value < 1000) return value.toString();

    if(value < 1000000) return (value / 1000).toFixed(1) + 'k';

    if(value < 1000000000) return (value / 1000000).toFixed(1) + 'm';

    return (value / 1000000000).toFixed(1) + 'b';
}


export function cleanInput (input: string){

    if(!input)
        return input;

    let clean: string;

    // Replace ' with slanted '
    clean = input.replaceAll("'", "’");

    return clean;

}

export function getFilePath(userId: number, postId: number, fileName: string): string {

    // Base
    let path = process.env.NEXT_PUBLIC_FTP_PUBLIC_URL + "/users/"

    // Add the user id
    path += userId + "/posts/"

    // Add the post id
    path += postId + "/" + fileName

    path = path.replaceAll("’", "'");

    return path;

}
