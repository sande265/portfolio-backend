import { Request, Response } from "express";
import { localValidation } from "../../../helpers";
import { indexOne, insert } from "./library.module";

const Constants = {
   module: "Library",
   validationRule: {
      nodes: ["required", "array"],
   },
};

export const createLibrary = (req: Request, res: Response) => {
   const body: any = req.body;
   const { error, localvalidationerror } = localValidation(body, Constants.validationRule, {}, false);
   if (localvalidationerror) {
      res.status(422).json({
         message: error,
      });
   } else {
      insert(body, (err: any, result: DataObj) => {
         if (err) {
            if (err.code === 11000) {
               let key = err?.keyPattern && Object.keys(err?.keyPattern)[0];
               res.status(422).json({
                  message: `${Constants.module} with the provided ${key} already exists`,
                  error: err,
               });
            } else
               res.status(500).json({
                  message: "Something went wrong",
                  _diag: err,
               });
         } else {
            res.json({
               message: `${Constants.module} created successfully.`,
               id: result?.id,
            });
         }
      });
   }
};

export const getLibrary = (req: Request, res: Response) => {
   indexOne((err: any, result: DataObj) => {
      if (err)
         res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true,
         });
      if (!result || Object.keys(result).length <= 0) {
         res.sendStatus(204);
      } else {
         res.json({
            data: result,
         });
      }
   });
};
