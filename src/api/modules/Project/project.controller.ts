import { Request, Response } from "express";
import { localValidation } from "../../../helpers";
import { paginate } from "../../../middlewares";
import { Projects } from "../../Schemas";
import { drop, index, indexOne, insert, modify } from "./project.module";

export const Constants = {
   module: "Project",
   validationRule: {
      title: ["required"],
      tech: ["required", "array"],
      github: ["string"],
      external: ["string"],
      html: ["string"],
      status: ["required", {
         param: "in",
         values: [1, 0]
      }],
      order: ["required"]
   },
};

export const createProject = (req: Request, res: Response) => {
   const body: any = req.body;
   const { error, localvalidationerror } = localValidation(body, Constants.validationRule, {}, false);
   if (localvalidationerror) {
      res.status(422).json({
         message: error,
      });
   } else {
      insert(body, (err: any, result: any) => {
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
            delete result?.password;
            res.json({
               message: `${Constants.module} created successfully.`,
               id: result?.id,
            });
         }
      });
   }
};

export const updateProject = (req: Request, res: Response) => {
   const { id } = req.params;
   const body: any = req.body;
   const { error, localvalidationerror } = localValidation(body, {}, {}, false);
   if (localvalidationerror) {
      res.status(422).json({
         message: error,
         error: true,
      });
   } else {
      modify(id, { ...body }, (err: any) => {
         if (err)
            res.status(500).json({
               message: "Something went wrong",
               _diag: err,
               error: true,
            });
         else
            res.json({
               message: `${Constants.module} updated successfully.`,
            });
      });
   }
};

export const deleteProjects = (req: Request, res: Response) => {
   drop((err: any) => {
      if (err) {
         res.status(500).json({
            messsage: "Failed to drop all configs",
            _diag: err,
            error: true,
         });
      } else
         res.json({
            message: `${Constants.module} deleted successfully.`,
         });
   });
};

export const getProjects = async (req: Request, res: Response) => {
   let { limit, q, page, filter, sort_by, sort_field }: any = req.query;
   limit = limit ? parseInt(limit) : 10;

   let itemFilter = {
      ...filter,
   };

   if (q) itemFilter = { ...itemFilter, title: { $regex: q, $options: "i" } };

   const count = await Projects.countDocuments(itemFilter);

   index({ limit: limit, page: page, sortBy: sort_by, sortField: sort_field, filter: itemFilter }, (err: any, result: Array<[]>) => {
      if (err)
         res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true,
         });
      else if (result?.length <= 0) {
         res.sendStatus(204);
      } else {
         res.json(paginate(result, limit, count, page));
      }
   });
};

export const getProject = (req: Request, res: Response) => {
   const { id } = req.params;
   indexOne(id, (err: any, result: { [key: string]: any }) => {
      if (err)
         res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true,
         });
      else if (!result || Object.keys(result)?.length <= 0) {
         res.sendStatus(204);
      } else {
         res.json(result);
      }
   });
};
