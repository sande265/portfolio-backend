import { model, Schema } from "mongoose";

const ExperienceSchema = new Schema(
   {
      title: {
         type: Schema.Types.String,
         required: true,
      },
      organization: {
         type: Schema.Types.ObjectId,
         ref: "Organization",
         required: true,
      },
      from: {
         type: Schema.Types.Date,
         required: true,
      },
      to: {
         type: Schema.Types.Date,
         default: null
      },
      description: {
         type: Schema.Types.String,
         required: true,
      },
      html: {
         type: Schema.Types.String,
         required: true,
      },
   },
   { timestamps: true, versionKey: false, collection: "experiences" },
);

export const Experience = model("Experience", ExperienceSchema);
