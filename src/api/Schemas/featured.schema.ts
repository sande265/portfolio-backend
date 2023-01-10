import { model, Schema } from "mongoose";

const FeaturedSchema: Schema = new Schema(
   {
      title: {
         type: Schema.Types.String,
         required: true,
      },
      project: {
         type: Schema.Types.ObjectId,
         ref: "Project",
         required: true,
      },
      cta: {
         type: Schema.Types.String,
         default: null,
      },
      attachments: [
         {
            type: Schema.Types.ObjectId,
            ref: "Attachment",
            required: true,
         },
      ],
      status: {
         type: Schema.Types.Number,
         required: false,
         default: 1
      },
   },
   { timestamps: true, versionKey: false, toJSON: { virtuals: true }, collection: "featured" },
);

// FeaturedSchema.virtual("projects", {
//    ref: "Project",
//    localField: "project_id",
//    foreignField: "_id",
// });

// FeaturedSchema.virtual("attachments", {
//    ref: "Attachment",
//    localField: "attachment_ids",
//    foreignField: "_id",
// });

FeaturedSchema.methods.toJSON = function () {
   let data = this.toObject();
   delete data.project_id;
   delete data.attachment_ids;
   return data;
};

const Featured = model("Featured", FeaturedSchema);

export { Featured };
export default Featured;
