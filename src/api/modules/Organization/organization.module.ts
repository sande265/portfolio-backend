import { Organization } from "../../Schemas";

export const index = ({ limit, page, sortBy, sortField, filter }: queryParams, callback: Function) => {
   const skips = page * limit - limit;
   try {
      Organization.find(filter)
         .limit(limit)
         .skip(skips)
         .sort(sortField && sortBy ? { [sortField]: sortBy === "asc" ? 1 : -1 } : {})
         .lean()
         .exec((error: any, result: any) => {
            if (error) callback(error);
            else return callback(null, result);
         });
   } catch (error) {
      return callback(error);
   }
};

export const indexOne = (_id: string | number, callback: Function) => {
   try {
      Organization.findOne({ _id }, {}, {})
         .lean()
         .exec((error: any, result: any) => {
            if (error) callback(error);
            else return callback(null, result);
         });
   } catch (error) {
      return callback(error);
   }
};

export const insert = async (payload: any, callback: Function) => {
   const config = new Organization<Document>(payload);
   try {
      Organization.init();
      await config.save();
      return callback(null, config.toJSON());
   } catch (error) {
      return callback(error);
   }
};

export const modify = (_id: string, payload: any, callback: Function) => {
   try {
      Organization.findOneAndUpdate({ _id }, payload, { new: true })
         .lean()
         .exec((err: any, result: any) => {
            if (err) callback(err);
            else callback(null, result);
         });
   } catch (error) {
      return callback(error);
   }
};

export const drop = (callback: Function) => {
   try {
      Organization.deleteMany({}, (err: any) => {
         if (err) {
            callback(err);
         } else {
            callback(null, {});
         }
      });
   } catch (error) {
      callback(error);
   }
};
