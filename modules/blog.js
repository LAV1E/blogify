const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        // default: "/images/default.png",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        // required: true,
    }
}, { timestamps: true });

const Blog = model("blogs", blogSchema);

module.exports = Blog;