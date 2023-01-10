import { User } from "../../Schemas/user.schema";

export const authenticate = (username: string | number, callback: Function) => {
    User.findOne({ username: username }).select(["password", "_id", "username", "email", "contact", "role", "status"]).lean().exec(
        (error: any, user: any) => {
            if (error) {
                callback(error, null);
            }
            else callback(null, user);
        }
    )
}