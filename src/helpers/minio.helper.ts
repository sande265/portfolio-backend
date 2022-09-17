import { Config } from "../config";
import { Client } from "minio";

export const minioClient = new Client({
   endPoint: Config.minioUrl?.split("//")[1],
   port: 9000,
   useSSL: false,
   accessKey: Config.minioAccessKey,
   secretKey: Config.minioSecret,
});

export const uploadObject = (file: any, name: string | any, cb: any) => {
   minioClient.putObject(Config.minioBucket, name, file, (errors, result) => {
      if (errors) {
         return cb(errors);
      }
      return cb(null, result);
   });
};

export const getObject = (name: string, callback: CallableFunction) => {
   let data: any;
   try {
      minioClient.getObject(Config.minioBucket, name, function (err, stream) {
         if (err) {
            return callback(err);
         } else {
            // if (getMimeType(name).includes("image")) {
            //    stream.on("data", function (chunk: any) {
            //       data = !data ? Buffer.from(chunk) : Buffer.concat([data, chunk]);
            //    });
            //    stream.on("end", function () {
            //       callback(null, data);
            //    });
            //    stream.on("error", function (err: Error) {
            //       callback(err);
            //    });
            // } else {
               callback(null, stream);
            // }
         }
      });
   } catch (error) {
      callback(error);
   }
};

export const deleteAllObjects = (callback: CallableFunction) => {
   let objects: Array<string> = [];
   var objectsStream = minioClient.listObjects(Config.minioBucket, "", true);

   objectsStream.on("data", function (obj: any) {
      objects.push(obj.name);
   });

   objectsStream.on("error", function (e: Error) {
      console.log(e);
   });

   objectsStream.on("end", function () {
      minioClient.removeObjects(Config.minioBucket, objects, (err: Error | null) => {
         if (err) callback(err);
         else callback(null, true);
      });
   });
};

export const deleteObject = (name: string, callback: CallableFunction) => {
   minioClient.removeObject(Config.minioBucket, name, (err: Error | null) => {
      if (err) callback(err);
      else callback(null, true);
   });
};
