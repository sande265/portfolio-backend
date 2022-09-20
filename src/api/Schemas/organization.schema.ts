import { model, Schema } from "mongoose";

const OrganizationSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    organization: {
        type: Schema.Types.String,
        required: true
    },
    website: {
        type: Schema.Types.String,
        default: null
    },
    location: {
        type: Schema.Types.String,
        default: null
    },
    country: {
        type: Schema.Types.String,
        required: true
    },
    description: {
        type: Schema.Types.String,
        default: null
    },
    status: {
        type: Schema.Types.Boolean,
        required: true,
     }
}, { timestamps: true, versionKey: false, collection: "organization" });

export const Organization = model("Organization", OrganizationSchema);