import { Role } from "./roles";


export type CreateUserParams = {
username: string;
password: string;
authType: string;
authValue:string;

}

export type UpdateUserParams = {
    username: string;
    password: string;
    authType: string;
    authValue:string;
    }


    export type createProfileParams={
        firstname: string;
        lastname: string;
        age: number;
        dob: string;
        additionalInfo: JSON,
        role: Role

    }

    export type CreatePostParams= {
        title :string;
        description: string;
    }