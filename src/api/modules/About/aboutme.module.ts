import { About } from "../../Schemas";

export const index = ({ limit, page, sortBy, filter }: queryParams, callback: Function) => {
   const skips = page * limit - limit;
   try {
      About.find(filter, {}, { limit: limit, sort: sortBy, skip: skips })
         .populate({
            path: "showcase",
            select: "name organization website country location description",
         })
         .populate({ path: "attachment", select: "name image height width" })
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
