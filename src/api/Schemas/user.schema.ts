import { model, Schema } from "mongoose";
import { config } from "dotenv";
import { insertUser } from "../modules/User/user.module";
import { genSaltSync, hashSync } from "bcrypt";

config();

const UserSchema = new Schema(
   {
      email: {
         type: String,
         required: true,
         match: /.+\@.+\..+/,
         unique: true,
      },
      name: {
         type: String,
      },
      username: {
         type: String,
         required: true,
         unique: true,
      },
      contact: {
         type: Schema.Types.Mixed,
         default: null,
      },
      role: {
         type: Schema.Types.Mixed,
         default: null,
      },
      password: {
         type: String,
         required: true,
         select: false,
      },
      configs: {
         type: Schema.Types.ObjectId,
         ref: "Config",
      },
      status: {
         type: Schema.Types.Number,
         required: false,
         default: 1,
      },
   },
   { timestamps: true, versionKey: false, collection: "users" },
);

UserSchema.methods.toJSON = function () {
   let data = this.toObject();
   delete data.password;
   return data;
};

export const User = model("User", UserSchema);

try {
   const salt = genSaltSync(10);
   const password: any = process.env.ADMIN_PASS;
   User.findOne({ username: "superadmin" }, {}, {}).exec((err, result) => {
      if (err) console.log("err", err);
      else {
         if (!result) {
            insertUser(
               {
                  name: "admin",
                  username: "superadmin",
                  email: "admin@sandeshsingh.com.np",
                  password: hashSync(password, salt),
                  contact: 1234567890,
                  status: 1,
               },
               (err: any, result: DataObj) => {
                  if (err && err.code !== 11000) console.log("Error: ", err);
                  else if (result) console.log("Admin Created.");
               },
            );
         }
      }
   });
} catch (error) {
   console.log("Fatal Error: ", error);
}
