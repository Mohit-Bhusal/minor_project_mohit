import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  itemName:{type:String },
  item_id: { type: String },
  userID: { type: String },
  quantity: { type: Number, default: 1 },
  issueDate: { type: Date, default: Date.now(), required: true },
  // returnDate: {
  //   type: Date,
  //   default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  // },
});

export const Issued = mongoose.model("Issued", issueSchema);
