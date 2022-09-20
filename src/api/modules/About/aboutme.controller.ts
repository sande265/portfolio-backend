import { Request, Response } from "express";
import { localValidation } from "../../../helpers";
import { paginate } from "../../../middlewares";
import { About, Attachment, Organization } from "../../Schemas";
import { index, indexOne, insert, modify } from "./aboutme.module";

export const Constants = {
   module: "About",
   validationRule: {
      name: ["required"],
      attachment: ["required"],
      showcase: ["required", "array"],
      status: ["required"],
      tech_stack: ["required", "array"],
      description: ["required"]
   },
};

export const createAbout = async (req: Request, res: Response) => {
   const body: any = req.body;
   const { error, localvalidationerror } = localValidation(body, Constants.validationRule, {}, false);
   if (localvalidationerror) {
      res.status(422).json({
         message: error,
      });
   } else {
      new Promise(async (resolve, reject) => {
         let orgs: boolean[] = [];
         let errors: any = {};
         let attachment: any;
         if (body.attachment.length === 24) attachment = await Attachment.findOne({ _id: body.attachment });
         else {
            errors = {
               ...errors,
               attachment: "Attachment ID is invalid.",
            };
         }
         body.showcase.map(async (org: string, idx: number) => {
            try {
               const result = await Organization.findOne({ _id: org });
               orgs.push(!!result);
               if (!attachment) {
                  errors = {
                     ...errors,
                     attachment: "Attachment with the given ID not found.",
                  };
               } else if (!result) {
                  errors = {
                     ...errors,
                     [`organization.${idx}`]: "Organization with provide ID not found.",
                  };
               }
            } catch (e: any) {
               errors = {
                  ...errors,
                  [`organization.${idx}`]: org.length === 24 ? e.message : "Organization ID invalid.",
               };
            }
            if (idx === body.showcase.length - 1) {
               if (attachment && orgs.length > 0) resolve({ message: "All Found" });
               else if (Object.keys(errors).length > 0) {
                  reject({ message: errors });
               }
            }
         });
      })
         .then(() => {
            About.find({ status: true }).then(
               (result: Array<DataObj>) => {
                  if (result.length > 0) {
                     res.json({ "message": "Another Aboutme with status active already exists." })
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
               }
            )
         })
         .catch((err) => {
            res.json({
               message: err.message,
            });
         });
   }
};

export const updateAbout = (req: Request, res: Response) => {
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

export const getAbouts = async (req: Request, res: Response) => {
   let { limit, q, page }: any = req.query;
   limit = limit ? parseInt(limit) : 10;

   const count = await About.countDocuments({ limit, page });

   index({ limit: limit, page: page }, (err: any, result: Array<[]>) => {
      if (err)
         res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true,
         });
      if (result?.length <= 0) {
         res.sendStatus(204);
      } else {
         if (!res.headersSent) res.json(paginate(result, limit, count, page));
      }
   });
};

export const getAbout = (req: Request, res: Response) => {
   const { id } = req.params;
   indexOne(id, (err: any, result: { [key: string]: any }) => {
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
            id: id,
         });
      }
   });
};
