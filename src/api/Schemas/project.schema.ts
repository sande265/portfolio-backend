import { model, Schema } from "mongoose";

const ProjectSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: true
    },
    tech: {
        type: Schema.Types.Array,
        required: true
    },
    github: {
        type: Schema.Types.String,
        default: null
    },
    external: {
        type: Schema.Types.String,
        default: null
    },
    html: {
        type: Schema.Types.String,
        default: null
    },
    order: {
        type: Schema.Types.Number,
        default: 0
    },
    status: {
        type: Schema.Types.Boolean,
        required: true,
     }
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, collection: "projects" });

export const Projects = model("Project", ProjectSchema);