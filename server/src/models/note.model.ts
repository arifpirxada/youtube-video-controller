import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true },
    note: { type: String, required: true },
  },
  { timestamps: true }
);

const noteModel = mongoose.model("note", noteSchema);

export default noteModel;
