import mongoose from "mongoose";
// import  pkg  from "nepali-date-converter";
function getDate() {
  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const second = currentDate.getSeconds();

  return `${date}/${month}/${year} ${hour}:${minute}`;
}
const date = getDate();

// Assuming you have an Item schema defined elsewhere
import { Item } from "./item_schema.js";

const returnSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  item_id: { type: String },
  item_name: { type: String }, // Add a field to store the item name
  userID: { type: String },
  quantity: { type: Number, default: 1 },
  issueDate: { type: String, default: date },
});

// Pre-save hook to populate the item name before saving the document
returnSchema.pre("save", async function (next) {
  try {
    const item = await Item.findOne({ item_id: this.item_id });
    if (item) {
      this.item_name = item.name; // Assuming the item name field in Item schema is 'name'
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const ReturnItem = mongoose.model("return", returnSchema);
