import { model, Schema } from "mongoose";

const AttachmentSchema: Schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    image: {
      type: Schema.Types.String,
      // match: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
    },
    height: {
      type: Schema.Types.Number,
      default: 438
    },
    width: {
      type: Schema.Types.Number,
      default: 700
    },
  },
  { timestamps: true, versionKey: false, collection: "attachments" },
);

const Attachment = model("Attachment", AttachmentSchema);

export { Attachment };
export default Attachment;
