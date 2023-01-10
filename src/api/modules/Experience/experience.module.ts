import { Experience } from "../../Schemas";

export const index = ({ limit, page, sortBy, sortField, filter }: queryParams, callback: Function) => {
   const skips = page * limit - limit;
   try {
      Experience.find(filter)
         .populate({
            path: "organization",
            select: "name organization website country location",
         })
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
      Experience.findOne({ _id }, {}, {})
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
   const config = new Experience<Document>(payload);
   try {
      Experience.init();
      await config.save();
      return callback(null, config.toJSON());
   } catch (error) {
      return callback(error);
   }
};

export const modify = (_id: string, payload: any, callback: Function) => {
   try {
      Experience.findOneAndUpdate({ _id }, payload, { new: true })
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
      Experience.deleteMany({}, (err: any) => {
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
