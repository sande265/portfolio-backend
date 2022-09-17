import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const checkDbConnection = () => (req: Request, res: Response, next: NextFunction) => {
   if (mongoose.connection.readyState === 1) {
      next();
   } else {
      if (!res.headersSent && req.path.match(/(api)/))
         mongoose.connection.on("error", (err: Error) => {
            res.status(500).json({
               message: "DB connection failed or DB not connected",
               _diag: err,
            });
            res.end();
         });
   }
};
