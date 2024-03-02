import mongoose, { Schema } from "mongoose";
const userIDSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    }
}
)

export const UserID=mongoose.model("UserID", userIDSchema);
