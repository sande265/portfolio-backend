import { model, Schema } from "mongoose";

const AboutSchema: Schema = new Schema(
   {
      name: {
         type: Schema.Types.String,
         required: true,
      },
      email: {
         type: Schema.Types.String,
         required: true,
      },
      contact: {
         type: Schema.Types.String,
         required: true,
      },
      country: {
         type: Schema.Types.Mixed,
         required: true,
      },
      attachment: {
         type: Schema.Types.ObjectId,
         ref: "Attachment",
         required: true,
      },
      resume: {
         type: Schema.Types.ObjectId,
         ref: "Attachment",
         required: true,
      },
      organization: [
         {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
         },
      ],
      status: {
         type: Schema.Types.Number,
         required: false,
         default: 1
      },
      tech_stack: {
         type: Schema.Types.Array,
         default: null,
      },
      description: {
         type: Schema.Types.String,
         required: true,
      }
   },
   { timestamps: true, versionKey: false, collection: "aboutme", autoCreate: true },
);

const About = model("About", AboutSchema);

export { About };
export default About;
