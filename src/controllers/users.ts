import {UserInstance} from "../models/User";

export const getUsers = async () => {
    try{
        const users = await UserInstance.findAll();
        return users;
    }catch (err) {
        console.log(err);
    }
}