import { NextFunction, Request, Response } from "express";

export const useCors = (options?: CorsOptions) => (req: Request, res: Response, next: NextFunction) => {
  if (options?.sameSite) res.header("Access-Control-Allow-Origin", options?.origin === "all" ? "*" : options?.origin);
  else res.header("Access-Control-Allow-Origin", "*");
  if (options?.credentials) res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  next();
};
