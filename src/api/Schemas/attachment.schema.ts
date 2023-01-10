import { model, Schema } from "mongoose";

const AttachmentSchema: Schema = new Schema(
   {
      name: {
         type: Schema.Types.String,
         required: true,
      },
      media: {
         type: Schema.Types.String,
         required: true,
      },
      height: {
         type: Schema.Types.Number,
         default: null,
      },
      width: {
         type: Schema.Types.Number,
         default: null,
      },
      status: {
         type: Schema.Types.Number,
         required: false,
         default: 1
      },
   },
   { timestamps: true, versionKey: false, collection: "attachments" },
);

const Attachment = model("Attachment", AttachmentSchema);

export { Attachment };
export default Attachment;
