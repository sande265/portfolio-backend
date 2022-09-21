import { NextFunction, Request, Response } from "express";

export const useCors = (options?: CorsOptions) => (req: Request, res: Response, next: NextFunction) => {
   res.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
   if (options?.sameSite) res.header("Access-Control-Allow-Origin", options?.origin === "all" ? "*" : options?.origin);
   else res.set("Access-Control-Allow-Origin", "*");
   if (options?.credentials) res.header("Access-Control-Allow-Credentials", "true");
   res.set("Access-Control-Allow-Headers", "content-type");
   res.set("Cross-Origin-Resource-Policy", options?.origin === "all" ? "*" : options?.origin ? options.origin : "cross-origin");
   if (req.method === "OPTIONS") {
      res.status(options?.optionsStatus ?? 204);
      res.end();
   } else next();
};
