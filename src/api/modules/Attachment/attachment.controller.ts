import { Request, Response } from "express";
import { localValidation, deleteAllObjects, getObject, uploadObject } from "../../../helpers";
import { paginate } from "../../../middlewares";
import { Attachment } from "../../Schemas";
import { drop, index, indexOne, insert, modify } from "./attachment.module";
import { checkFileConstraints, getFileExtension, getMaxUploadSize, getMimeType } from "../../../shared";
import sharp, { Sharp } from "sharp";
import { Config } from "../../../config";

export const Constants = {
   module: "Attachments",
   validationRule: {
      name: ["required"],
      media: ["required"],
      status: ["required", {
         param: "in",
         values: [1, 0]
      }],
   },
   fileSize: Config.fileSizeLimit,
};

export const getPublicFile = (req: Request, res: Response) => {
   let { name } = req.params;
   let height: any = req?.query?.h;
   let width: any = req?.query?.w;
   let quality: any = req?.query?.q;

   getObject(name, (err: Error, result: any) => {
      if (err) {
         res.status(404).send(err.message);
      } else {
         quality = parseInt(quality);
         height = parseInt(height);
         width = parseInt(width);
         if (getMimeType(name)?.includes("image")) {
            let type: any = getFileExtension(name);
            if (width || height || quality) {
               const streamImage: Sharp = sharp({ failOnError: true });
               streamImage
                  .resize({ height: height ? height : undefined, width: width ? width : undefined })
                  .toFormat("jpeg")
                  .jpeg({ quality: quality ? quality : undefined })
                  .toFormat(type)
                  .toBuffer()
                  .then((data: any) => {
                     res.writeHead(200, { "Content-Type": getMimeType(name) });
                     res.write(data);
                     res.end();
                  });
               result.pipe(streamImage);
            } else {
               res.writeHead(206, { "Content-Type": getMimeType(name) });
               result.pipe(res);
            }
         } else if (getMimeType(name)?.includes("application")) {
            let data: any;
            result.on("data", function (chunk: any) {
               data = !data ? Buffer.from(chunk) : Buffer.concat([data, chunk]);
            });
            result.on("end", function () {
               res.writeHead(200, {
                  "Content-Type": getMimeType(name),
                  "Content-Length": data?.length,
                  "Content-Disposition": `attachment; filename="${name}"`
               })
               res.end(data)
            });
            result.on("error", function (err: Error) {
               console.log("Error Converting Application");
            });
         } else {
            res.setHeader("Content-Type", getMimeType(name));
            res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
            result.pipe(res);
         }
      }
   });
};

export const createAttachment = (req: Request, res: Response) => {
   if (
      req.file &&
      checkFileConstraints(req.file, getMimeType(req.file?.originalname), getMaxUploadSize(getMimeType(req.file?.originalname)))
   ) {
      const type = getMimeType(req.file?.originalname);
      res.status(413).json({
         message: "File size is greater than allowed limit.",
         file_name: req.file?.originalname,
         max_file_fize: `${parseFloat(`${getMaxUploadSize(type)}`).toFixed(2)} KB`,
         current_file_size: `${parseFloat(`${req.file?.buffer?.length / 1024}`).toFixed(2)} KB`,
         status_code: 413,
      });
   } else {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = uniqueSuffix.toString() + "-" + req?.file?.originalname?.replace(/[^a-zA-Z_.]/g, "");

      let body = req.body;
      body["media"] = req.file;
      const { error, localvalidationerror } = localValidation(body, Constants.validationRule, {}, false);
      if (localvalidationerror) {
         res.status(422).json({
            message: error,
         });
      } else {
         const body: any = req.body;
         const localURL = req.baseUrl
         const baseUrl = process.env.ENV === "development" ? req.protocol + "://" +req.hostname : Config.appUrl;

         if (req.file) {
            body["media"] = `${baseUrl}/api/media/${fileName}`;
         }

         insert(body, (err: Error, result: DataObj) => {
            if (err) {
               res.status(500).json({
                  message: "Something went wrong",
                  _diag: err,
               });
            } else if (result) {
               try {
                  uploadObject(req.file?.buffer, fileName, (error: any, result: any) => {
                     if (error) console.log("Minio Upload Error: ", err);
                     else
                        res.json({
                           message: `${Constants.module} created successfully.`,
                           id: result?.id,
                        });
                  });
               } catch (error) {
                  console.log("erro", error);
               }
            }
         });
      }
   }
};

export const updateAttachment = (req: Request, res: Response) => {
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

export const deleteAttachments = (req: Request, res: Response) => {
   drop((err: any) => {
      if (err) {
         res.status(500).json({
            messsage: "Failed to drop all configs",
            _diag: err,
            error: true,
         });
      } else {
         deleteAllObjects((error: Error) => {
            if (error)
               res.status(500).json({
                  message: "Something went wrong",
                  _diag: error,
               });
            res.json({
               message: `${Constants.module} deleted successfully.`,
            });
         });
      }
   });
};

export const getAttachments = async (req: Request, res: Response) => {
   let { limit, q, page }: any = req.query;
   limit = limit ? parseInt(limit) : 10;

   const count = await Attachment.countDocuments({ limit, page });

   index({ limit: limit, page: page }, (err: any, result: Array<[]>) => {
      if (err)
         res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true,
         });
      else if (result.length <= 0) {
         res.sendStatus(204);
      } else {
         res.json(paginate(result, limit, count, page));
      }
   });
};

export const getAttachment = (req: Request, res: Response) => {
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
