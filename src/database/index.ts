const mongoose = require("mongoose");
require("dotenv").config();

export const initateDB = () => {
    try {
        const user: string | undefined = process.env.DB_USER;
        const pass: string | any = process.env.DB_PASS;
        const host: string | undefined = process.env.DB_HOST;
        const port: string | number | undefined = process.env.DB_PORT;
        if (user && pass && host && port) {
            const url = `mongodb://${user}:${encodeURIComponent(pass)}@${host}:${port}`;
            mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoIndex: true,
                dbName: "portfolio"
            }, (error: Error) => {
                if (error) console.log("Mongo Error =>", error?.message);
            });
            db.once("open", function () {
                console.log("Connected successfully");
            });
        } else {
            console.log("Failed No ENV", process.env);
        }
    } catch (error: any) {
        db.on("error", () => console.log("error connecting to DB"))
    }
}

export const db = mongoose.connection;