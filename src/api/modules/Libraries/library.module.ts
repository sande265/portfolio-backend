import { Library } from "../../Schemas/library.schema";

export const indexOne = (callback: Function) => {
    try {
        Library.find({}).lean().exec(
            (error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result[0]);
            }
        )
    } catch (error) {
        return callback(error);
    }
}

export const insert = async (payload: any, callback: Function) => {
    const config = new Library<Document>(payload);
    try {
        Library.init();
        await config.save();
        return callback(null, config.toJSON());
    } catch (error) {
        return callback(error);
    }
}