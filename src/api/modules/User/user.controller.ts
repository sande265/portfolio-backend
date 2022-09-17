import { genSaltSync, hashSync } from "bcrypt";
import { Request, Response } from "express";
import { localValidation } from "../../../helpers/validation.helper";
import { paginate } from "../../../middlewares/paginate.middleware";
import { User } from "../../Schemas/user.schema";
import { dropUsers, indexUser, indexUsers, insertUser, modifyUser } from "./user.module";

const Constants = {
    vaidationRule: {
        name: ["required"],
        username: ["required"],
        email: ["required", "email"],
        password: ["password"],
        contact: ["string", "number"],
        role: ["*"],
    }
}

export const createUser = (req: Request, res: Response) => {
    const body: any = req.body;
    const { error, localvalidationerror } = localValidation(body, Constants.vaidationRule, {}, false);
    if (localvalidationerror) {
        res.status(422).json({
            message: error
        })
    } else {
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        insertUser(body, (err: any, result: any) => {
            if (err) {
                if (err.code === 11000) {
                    let key = err?.keyPattern && Object.keys(err?.keyPattern)[0]
                    res.status(422).json({
                        message: `User with the provided ${key} already exists`,
                        error: err
                    })
                } else res.status(500).json({
                    message: "Something went wrong",
                    _diag: err,
                })
            }
            else {
                delete result?.password;
                res.json({
                    message: "User created successfully.",
                    user: result
                })
            }
        })
    }
}

export const updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const body: any = req.body;
    const { email, name, role, contact, configs }: any = body;
    const { error, localvalidationerror } = localValidation(body,  Constants.vaidationRule, {}, false);
    if (localvalidationerror) {
        res.status(422).json({
            message: error
        })
    } else {
        modifyUser(id, { email, name, role, contact, configs }, (err: any, result: any) => {
            if (err) {
                if (err.code === 11000) {
                    let key = err?.keyPattern && Object.keys(err?.keyPattern)[0]
                    res.status(422).json({
                        message: `User with the provided ${key} already exists`,
                        _diag: err,
                        error: true
                    })
                } else res.status(500).json({
                    message: "Something went wrong",
                    _diag: err,
                    error: true
                })
            }
            else {
                delete result?.password;
                res.json({
                    message: "User updated successfully.",
                    user: result
                })
            }
        })
    }
}

export const deleteUsers = (req: Request, res: Response) => {
    dropUsers((err: any, result: any) => {
        if (err) {
            res.status(500).json({
                messsage: "Failed to drop document",
                error: err
            })
        }
        else res.json({
            message: "Users document dropped successfully.",
            _diag: result
        })
    })
}

export const getUsers = async (req: Request, res: Response) => {
    let { limit, q, page }: any = req.query;
    limit = limit ? parseInt(limit) : 10;

    const count = await User.countDocuments();

    indexUsers({ limit: limit, page: page }, (err: any, result: Array<[]>) => {
        if (err) res.status(500).json({
            message: "Somthing went wrong",
            error: err
        })
        if (result.length <= 0) {
            res.sendStatus(204);
        } else {
            res.json(paginate(result, limit, count, page));
        }
    })
};

export const getUser = (req: Request, res: Response) => {
    const { id } = req.params;
    indexUser(id, (err: any, result: { [key: string]: any }) => {
        if (err) res.status(500).json({
            message: "Somthing went wrong",
            error: err
        })
        if (!result || Object.keys(result).length <= 0) {
            res.sendStatus(204);
        } else {
            res.json(result);
        }
    })
};