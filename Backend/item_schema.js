import mongoose, { Schema } from "mongoose";
// import {User} from "./user.model.js"
const itemSchema = new Schema(
  {
    itemName: {
      type: String,
      unique: true,
      required: true,
    },
    item_id: {
      type: String,
      unique: true,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
function getDate() {
  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth()+1;
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const second=currentDate.getSeconds();

  return `${date}/${month}/${year} ${hour}:${minute}:${second}`;
}
const date = getDate();

export const Item = mongoose.model("Item", itemSchema);
