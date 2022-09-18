import { model, Schema } from "mongoose";

const LibrarySchema = new Schema({
    nodes: {
        type: Schema.Types.Array,
        required: true
    },
}, { timestamps: true, versionKey: false, collection: "libraries" });

export const Library = model("Library", LibrarySchema);