import { Projects } from "../../Schemas";

export const index = ({ limit, page, sortBy, filter }: queryParams, callback: Function) => {
   const skips = page * limit - limit;
   try {
      Projects.find(filter, {}, { limit: limit, sort: sortBy, skip: skips })
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
      Projects.findOne({ _id }, {}, {})
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
   const config = new Projects<Document>(payload);
   try {
      Projects.init();
      await config.save();
      return callback(null, config.toJSON());
   } catch (error) {
      return callback(error);
   }
};

export const modify = (_id: string, payload: any, callback: Function) => {
   try {
      Projects.findOneAndUpdate({ _id }, payload, { new: true })
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
      Projects.deleteMany({}, (err: any) => {
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
