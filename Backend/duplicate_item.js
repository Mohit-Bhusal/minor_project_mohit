import mongoose from "mongoose";
import { Issued } from "./total_schem.js";

// Define schema for duplicated collection
const duplicatedSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  itemName: { type: String },
  item_id: { type: String },
  userID: { type: String },
  quantity: { type: Number, default: 1 },
  issueDate: { type: Date, default: Date.now(), required: true },
});

// Create model for duplicated collection


// Function to duplicate Issued collection
const duplicateIssued = async () => {
  try {
    // Fetch documents from Issued collection
    const issuedItems = await Issued.find();

    // Create duplicates in the Duplicated collection
    const duplicatedItems = await Duplicated.create(issuedItems);

    console.log("Duplicated items:", duplicatedItems);
  } catch (error) {
    console.error("Error duplicating items:", error);
  }
};

// Call the function to duplicate Issued collection
duplicateIssued();
export const Duplicated = mongoose.model("Duplicated", duplicatedSchema);
