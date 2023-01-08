import { Request, Response } from "express";
import { localValidation } from "../../../helpers";
import { paginate } from "../../../middlewares";
import { checkIfValidID } from "../../../shared";
import { Attachment, Featured, Projects } from "../../Schemas";
import { drop, index, indexOne, insert, modify } from "./featured.module";

export const Constants = {
   module: "Featured Project",
   validationRule: {
      title: ["required"],
      attachments: ["required", "array"],
      project: ["required", "string"],
      cta: ["string"],
      status: ["required"],
   },
};

export const createFeatured = (req: Request, res: Response) => {
   const body: any = req.body;
   const { error, localvalidationerror } = localValidation(body, Constants.validationRule, {}, false);
   if (localvalidationerror) {
      res.status(422).json({
         message: error,
      });
   } else {
      new Promise(async (resolve, reject) => {
         let attachments: boolean[] = [];
         let errors: any = {};
         let project: any = {};
         if (checkIfValidID(body.project)) project = await Projects.findOne({ _id: body.project });
         else {
            errors = {
               ...errors,
               attachment: "Project ID is invalid.",
            };
         }
         body.attachments.map(async (media: any, idx: number) => {
            try {
               const result = await Attachment.findOne({ _id: media });
               attachments.push(!!result);
               if (!project) {
                  errors = {
                     ...errors,
                     project: "Project with the given ID not found.",
                  };
               } else if (!result) {
                  errors = {
                     ...errors,
                     [`attachments.${idx}`]: "Attachment with provide ID not found.",
                  };
               }
            } catch (e: any) {
               errors = {
                  ...errors,
                  [`attachments.${idx}`]: checkIfValidID(media) ? e.message : "Attachment ID invalid.",
               };
            }
            if (idx === body.attachments.length - 1) {
               if (project && attachments.length > 0) resolve({ message: "All Found" });
               else if (Object.keys(errors).length > 0) {
                  reject({ message: errors });
               }
            }
         });
      })
         .then(() => {
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
         })
         .catch((err) => {
            res.json({
               message: err.message,
            });
         });
   }
};

export const updateFeatured = (req: Request, res: Response) => {
   const { id } = req.params;
   const body: any = req.body;
   const { error, localvalidationerror } = localValidation(body, Constants.validationRule, {}, false);
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

export const deleteFeatureds = (req: Request, res: Response) => {
   drop((err: any) => {
      if (err) {
         res.status(500).json({
            messsage: `Failed to drop all ${Constants.module}`,
            _diag: err,
            error: true,
         });
      } else
         res.json({
            message: `${Constants.module} deleted successfully.`,
         });
   });
};

export const getFeatureds = async (req: Request, res: Response) => {
   let { limit, q, page, filter, sort_by, sort_field }: any = req.query;
   limit = limit ? parseInt(limit) : 10;

   let itemFilter = {
      ...filter,
   };

   if (q) itemFilter = { ...itemFilter, title: { $regex: q, $options: "i" } };

   const count = await Featured.countDocuments(itemFilter);

   index({ limit: limit, page: page, sortBy: sort_by, sortField: sort_field, filter: itemFilter }, (err: any, result: Array<[]>) => {
      if (err)
         res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true,
         });
      if (result.length <= 0) {
         res.sendStatus(204);
      } else {
         res.json(paginate(result, limit, count, page));
      }
   });
};

export const getFeatured = (req: Request, res: Response) => {
   const { id } = req.params;
   indexOne(id, (err: any, result: { [key: string]: any }) => {
      if (err)
         res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true,
         });
      if (!result || Object.keys(result)?.length <= 0) {
         res.sendStatus(204);
      } else {
         res.json({
            data: result,
            id: id,
         });
      }
   });
};
