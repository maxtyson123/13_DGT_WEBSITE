import {User} from "next-auth";

export const MEMBER_USER_TYPE = 0;
export const EDITOR_USER_TYPE = 1;
export const ADMIN_USER_TYPE = 2;

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
    user_image: string,
    user_restricted_access: boolean,
}

export interface UserPermissions {
    api: {
        auth: {
            edit_auth: {
                publicAccess: boolean;
                internalAccess: boolean;
                add: boolean;
                remove: boolean;
                fetch: boolean;
            };
            random: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
        };
        files: {
            backup_database: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            backup_files: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            upload: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
        };
        plants: {
            download: {
                publicAccess: boolean;
                internalAccess: boolean;
                restrictedData: boolean;
            };
            json: {
                publicAccess: boolean;
                internalAccess: boolean;
                download: boolean;
                upload: boolean;
                convert: boolean;
            };
            months: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            random: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            remove: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            search: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            upload: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            uses: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
        };
        user: {
            keys: {
                publicAccess: boolean;
                internalAccess: boolean;
                add: boolean;
                remove: boolean;
                edit: boolean;
                fetch: boolean;
                clearLogs: boolean;
            };
            data: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            delete: {
                publicAccess: boolean;
                internalAccess: boolean;
                others: boolean;
            };
            email: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            new: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            plants: {
                publicAccess: boolean;
                internalAccess: boolean;
            };
            update: {
                publicAccess: boolean;
                internalAccess: boolean;
                admin: boolean;
            };
            follow: {
                publicAccess: boolean;
                internalAccess: boolean;
                followingCount: boolean;
                followersCount: boolean;
                follow: boolean;
                unfollow: boolean;
                checkFollowing: boolean;
                list: boolean;
            };
        };
    };

    pages: {
        admin: {
            publicAccess: boolean;
        };
        account: {
            publicAccess: boolean;
        };
        plants: {
            publicAccess: boolean;
            edit: boolean;
        };
    };

    data:{
        account: {
            viewPrivateDetails: boolean;
        };

        plants: {
            viewRestrictedSections: boolean;
        };

        posts: {
            moderate: {
                publicAccess: boolean;
                internalAccess: boolean
            };
            edit: {
                publicAccess: boolean;
                internalAccess: boolean
            }
        }

        logs: {
            unlimitedApiLogEntries: boolean;
        }
    }
}

export const getDefaultPermissions = () : UserPermissions => {
    return {
        api: {
            auth: {
                edit_auth: {
                    publicAccess: false,
                    internalAccess: false,
                    add: false,
                    remove: false,
                    fetch: false,
                },

                random: {
                    publicAccess: false,
                    internalAccess: false,
                },
            },

            files: {
                backup_database: {
                    publicAccess: false,
                    internalAccess: false,
                },
                backup_files: {
                    publicAccess: false,
                    internalAccess: false,
                },
                upload: {
                    publicAccess: false,
                    internalAccess: false,
                }
            },

            plants: {
                download: {
                    publicAccess: false,
                    internalAccess: true,
                    restrictedData: false,
                },

                json: {
                    publicAccess: false,
                    internalAccess: true,
                    download: true,
                    upload: false,
                    convert: false,
                },

                months: {
                    publicAccess: false,
                    internalAccess: true,
                },

                random: {
                    publicAccess: false,
                    internalAccess: true,
                },

                remove: {
                    publicAccess: false,
                    internalAccess: false,
                },

                search: {
                    publicAccess: true,
                    internalAccess: true,
                },

                upload: {
                    publicAccess: false,
                    internalAccess: false,
                },

                uses: {
                    publicAccess: false,
                    internalAccess: true,
                },
            },

            user: {
                keys: {
                    publicAccess: false,
                    internalAccess: true,
                    add: true,
                    remove: true,
                    edit: true,
                    fetch: true,
                    clearLogs: true,
                },

                data: {
                    publicAccess: false,
                    internalAccess: true,
                },

                delete: {
                    publicAccess: false,
                    internalAccess: true,
                    others: false,
                },

                email: {
                    publicAccess: false,
                    internalAccess: true,
                },

                new: {
                    publicAccess: false,
                    internalAccess: false,
                },

                plants: {
                    publicAccess: false,
                    internalAccess: true,
                },

                update: {
                    publicAccess: false,
                    internalAccess: true,
                    admin: false,
                },

                follow: {
                    publicAccess: false,
                    internalAccess: true,
                    followingCount: true,
                    followersCount: true,
                    follow: true,
                    unfollow: true,
                    checkFollowing: true,
                    list: true,
                }
            },

        },

        pages: {
            admin: {
                publicAccess: false,
            },

            account: {
                publicAccess: false,
            },

            plants: {
                publicAccess: true,
                edit: false,
            },
        },

        data: {
            account: {
                viewPrivateDetails: false,
            },

            posts: {
                moderate: {
                    publicAccess: false,
                    internalAccess: false,
                },
                edit: {
                    publicAccess: false,
                    internalAccess: true,
                }
            },

            plants: {
                viewRestrictedSections: false,
            },

            logs: {
                unlimitedApiLogEntries: false,
            },
        }
    }
}

export function getUserPermissions(user: RongoaUser | null) {

    let permissions : UserPermissions = getDefaultPermissions();

    // If there is no user logged in it must be a guest
    if(user == null)
    {
        return permissions;
    }

    // Check if they are allowed to view restricted data
    permissions.data.plants.viewRestrictedSections = user.database.user_restricted_access;

    // If they are a member allow them to use parts of the api non-internally
    if(user.database.user_type >= MEMBER_USER_TYPE) {

        // API
        permissions.api.files.upload.internalAccess = true;     // To Upload their custom profile image
        permissions.api.plants.json.publicAccess = true;
        permissions.api.plants.months.publicAccess = true;
        permissions.api.plants.random.publicAccess = true;
        permissions.api.plants.search.publicAccess = true;
        permissions.api.plants.uses.publicAccess = true;
        permissions.api.user.data.publicAccess = true;
        permissions.api.user.plants.publicAccess = true;

        // Pages
        permissions.pages.account.publicAccess = true;

    }

    // If they are an editor allow them to upload plants and edit pages
    if(user.database.user_type >= EDITOR_USER_TYPE) {

        // API
        permissions.api.plants.download.publicAccess = true;
        permissions.api.plants.json.upload = true;
        permissions.api.plants.upload.internalAccess = true;
        permissions.api.plants.json.convert = true;
        permissions.api.plants.remove.internalAccess = true;
        permissions.api.plants.upload.publicAccess = true;

        // Pages
        permissions.pages.plants.edit = true;
    }

    // If they are an admin enable all permissions
    if(user.database.user_type == ADMIN_USER_TYPE) {
        permissions = setPermissions(permissions, true)
    }


    return permissions;

}

const setPermissions = (permissions: UserPermissions, value: boolean) : UserPermissions => {


    for (let key in permissions) {

        if(!permissions.hasOwnProperty(key)) continue;

        // @ts-ignore
        if (typeof permissions[key] === "object") {
            // @ts-ignore
            permissions[key] = setPermissions(permissions[key], value);
        } else {
            // @ts-ignore
            permissions[key] = value;
        }
    }

    return permissions;

}

/**
 * Check if a user has a permission
 * @param user The user to check
 * @param permission The permission to check e.g. "api:plants:upload:publicAccess"
 *
 * @returns {boolean} - If the user has the permission (false if the permission doesn't exist)
 */
export function checkUserPermissions(user: RongoaUser, permission: string) : boolean{

    return checkPermissions(getUserPermissions(user), permission);

}

export function checkPermissions(permissions: UserPermissions, permission: string) : boolean {

    // Split the string into the different sections by the :
    const sections = permission.split(":");

    // Get the section of the permissions
    let section = permissions;
    for(let i = 0; i < sections.length; i++) {

        // If the section is undefined return false
        if(section == undefined) {
            return false;
        }

        // @ts-ignore
        section = section[sections[i]];
    }

    // Otherwise should be a boolean so return it
    // @ts-ignore
    return section;

}

export function getStrings(permissions: UserPermissions) {

    let strings: string[] = []

    // Loop through the permissions
    for (let key in permissions) {

        if(!permissions.hasOwnProperty(key)) continue;

        // @ts-ignore
        let value = permissions[key] as any

        // If the value is an object, then loop through it
        if (typeof value === "object") {

            // Add the sub values to the strings
            let subStrings = getStrings(value)
            for (let subString of subStrings) {
                strings.push(key + ":" + subString)
            }

        } else {

            // Check if the permission is true
            if (value === true && key !== "internalAccess") {
                if (key === "publicAccess") {
                    strings.push("access")
                }else{
                    strings.push(key)
                }

            }
        }
    }
    return strings
}
