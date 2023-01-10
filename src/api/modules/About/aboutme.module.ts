import { About } from "../../Schemas";

export const index = ({ limit, page, sortBy, filter, sortField }: queryParams, callback: Function) => {
   const skips = page * limit - limit;
   try {
      About.find(filter)
         .populate({
            path: "organization",
            select: "name organization website country location description",
         })
         .populate({ path: "attachment", select: "name media height width" })
         .populate({ path: "resume", select: "name media" })
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

export const insert = async (payload: any, callback: Function) => {
   const config = new About<Document>(payload);
   try {
      About.init();
      await config.save();
      return callback(null, config.toJSON());
   } catch (error) {
      return callback(error);
   }
};

export const modify = (_id: string, payload: any, callback: Function) => {
   try {
      About.findOneAndUpdate({ _id }, payload, { new: true })
         .lean()
         .exec((err: any, result: any) => {
            if (err) callback(err);
            else callback(null, result);
         });
   } catch (error) {
      return callback(error);
   }
};

export const indexOne = (_id: string | number, callback: Function) => {
   try {
      About.findOne({ _id }, {}, {})
         .lean()
         .exec((error: any, result: any) => {
            if (error) callback(error);
            else return callback(null, result);
         });
   } catch (error) {
      return callback(error);
   }
};
