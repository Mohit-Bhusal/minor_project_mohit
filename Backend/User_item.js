import { User } from "./user.model.js";
import { Total } from "./total_schema.js"; // Make sure to use the correct file name

const requestItem = async (req, res) => {
  try {
    const { userID, itemID, quantity } = req.body;

    // Check if the user exists
    const user = await User.findOne({ userID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create or update the Total document for the item and user
    await Total.findOneAndUpdate(
      { item_id: itemID, user: user._id },
      { item_id: itemID, user: user._id, $inc: { quantity: quantity } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Item request processed successfully" });
  } catch (error) {
    console.error("Error during item request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { requestItem };
