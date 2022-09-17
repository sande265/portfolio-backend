import { Request, Response } from "express";
import { localValidation } from "../../../helpers/validation.helper";
import { authenticate } from "./oauth.module";
import { compareSync } from "bcrypt";
import { generateToken } from "../../../utils";

export const login = (req: Request, res: Response) => {
    let body = req.body;
    const rule = {
        username: ["required", "string"],
        password: ["required"]
    }
    let { error, localvalidationerror } = localValidation(body, rule);
    if (localvalidationerror) {
        res.status(422).json({
            message: error
        })
    } else {
        authenticate(body.username, (err: any, result: any) => {
            if (err) {
                res.status(500).json({
                    message: "Something Went Wrong",
                    _diag: err
                })
            }
            else if (!result) {
                res.status(401).json({
                    message: "Invalid username or password"
                })
            } else if (result) {
                const validPassword: boolean = compareSync(body.password, result.password);
                if (!validPassword) res.status(401).json({
                    message: "Incorrect password, please try again."
                })
                else {
                    result.password = undefined;
                    const iss: string = req.hostname;
                    const authData = generateToken(result, iss);
                    typeof authData === "string" ? res.status(400).json({ message: authData }) : res.json(authData)
                }
            }
        })
    }
}