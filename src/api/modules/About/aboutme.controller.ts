import { Request, Response } from "express";
import { localValidation } from "../../../helpers";
import { paginate } from "../../../middlewares";
import { About, Attachment, Organization } from "../../Schemas";
import { index, indexOne, insert, modify } from "./aboutme.module";

export const Constants = {
   module: "About",
   validationRule: {
      name: ["required"],
      email: ["required", "email"],
      contact: ["required"],
      country: ["required"],
      resume: ["required"],
      attachment: ["required"],
      organization: ["required"],
      status: [
         "required",
         {
            param: "in",
            values: [1, 0],
         },
      ],
      tech_stack: ["required", "array"],
      description: ["required"],
   },
};

export const createAbout = async (req: Request, res: Response) => {
   const body: any = req.body;
   const { localvalidationerror, error } = localValidation(body, Constants.validationRule, {}, false);
   if (localvalidationerror) {
      res.status(422).json({
         message: error,
      });
   } else {
      new Promise(async (resolve, reject) => {
         let orgs: boolean[] = [];
         let errors: any = {};
         let attachment: any;
         let resume: any;
         if (body?.attachment?.length === 24) attachment = await Attachment.findOne({ _id: body.attachment });
         if (body?.resume?.length === 24) resume = await Attachment.findOne({ _id: body.resume });
         if (!attachment) {
            errors = {
               ...errors,
               attachment: "Invalid attachment id Provided.",
            };
         }
         if (!resume) {
            errors = {
               ...errors,
               resume: "Invalid attachment id for resume Provided.",
            };
         }
         body.organization.forEach(async (org: string, idx: number) => {
            const result = await Organization.findOne({ _id: org });
            if (!result) {
               errors = {
                  ...errors,
                  [`organization.${idx}._id`]: "Invalid organization id " + org + " provided.",
               };
            } else {
               if (result) orgs.push(!!result);
            }
            if (body.organization.length - 1 === idx) {
               if (attachment && resume && orgs.length > 0) resolve({ message: "All Found" });
               else if (Object.keys(errors).length > 0) {
                  reject({ message: errors })
               }
            }
         });
      })
         .then(() => {
            About.find({ status: 0 }).then((result: Array<DataObj>) => {
               if (result.length > 0) {
                  res.json({ message: "Another Aboutme with status active already exists." });
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
            });
         })
         .catch((err) => {
            res.status(422).json({
               message: err.message,
            });
         });
   }
};

export const updateAbout = (req: Request, res: Response) => {
   const { id } = req.params;
   const body: any = req.body;
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
};

export const getAbouts = async (req: Request, res: Response) => {
   let { limit, q, page, filter, sort_by, sort_field }: any = req.query;
   limit = limit ? parseInt(limit) : 10;

   let itemFilter = {
      ...filter,
   };

   if (q) itemFilter = { ...itemFilter, title: { $regex: q, $options: "i" } };

   const count = await About.countDocuments(itemFilter);

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
      else if (!result || Object.keys(result).length <= 0) {
         res.sendStatus(204);
      } else {
         res.json({
            data: result,
            id: id,
         });
      }
   });
};
