import {User} from "next-auth";

export const ADMIN_USER_TYPE = 0;
export const EDITOR_USER_TYPE = 1;
export const MEMBER_USER_TYPE = 2;

export const UNDEFINED_USER_TYPE = -1;

export interface RongoaUser extends User{

    database: UserDatabaseDetails

}

export interface UserDatabaseDetails {

    id: number,
    user_name: string,
    user_email: string,
    user_type: number,
    user_last_login: string,
    user_api_keys: object,


}