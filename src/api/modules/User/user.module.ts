import { User } from "../../Schemas/user.schema";

export const indexUsers = async ({ limit, page, sortBy, filter }: queryParams, callback: Function) => {
   const skips = page * limit - limit;
   try {
      User.find(filter, {}, { limit: limit, sort: sortBy, skip: skips })
         .lean()
         .exec((error: any, result: any) => {
            if (error) callback(error);
            else return callback(null, result);
         });
   } catch (error) {
      return callback(error);
   }
};

export const indexUser = (_id: string | number, callback: Function) => {
   try {
      User.findOne({ _id })
         .populate({ path: "configs", select: "self teams_users applications" })
         .lean()
         .exec((error: any, result: any) => {
            if (error) callback(error);
            else return callback(null, result);
         });
   } catch (error) {
      return callback(error);
   }
};

export const insertUser = async (payload: any, callback: Function) => {
   const user = new User<Document>(payload);
   try {
      User.init();
      await user.save();
      return callback(null, user.toJSON());
   } catch (error) {
      return callback(error);
   }
};

export const modifyUser = (_id: string, payload: any, callback: Function) => {
   try {
      User.findByIdAndUpdate({ _id }, payload, { new: true })
         .lean()
         .exec((err: any, result: any) => {
            if (err) callback(err);
            else callback(null, result);
         });
   } catch (error) {
      return callback(error);
   }
};

export const dropUsers = (callback: Function) => {
   try {
      User.deleteMany({}, (err: any) => {
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
