import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { Config } from "../config";

export const FileFilter = multer({
   storage: multer.memoryStorage(),
   limits: {
      fileSize: Config.fileSizeLimit,
   }
});