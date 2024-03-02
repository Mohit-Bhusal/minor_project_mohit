// item.controller.js
import { Item } from "./item_schema.js";
import { ReturnItem } from "./return_schema.js";
import { Issued } from "./total_schem.js";
import mongoose from "mongoose";
import { Duplicated } from "./duplicate_item.js";
import { User } from "./user.model.js";

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

export const getItems = async (req, res) => {
  const query = Item.find();

  query
    .then((documents) => {
      res.status(200).json(documents);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const updateQuantity = async (req, res) => {
  // const { itemID, quantity } = req.body;
  const updatedQuantities = req.body.data;

  try {
    for (const itemId in updatedQuantities) {
      const value = updatedQuantities[itemId];

      await Item.findOneAndUpdate({ item_id: itemId }, { quantity: value });
    }

    res.status(200).send("DONE");
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "HELLO" });
  }
};

export const addTotal = async (req, res) => {
  const { userId, itemId, quantity } = req.body;

  const user = await User.findOne({ userID: userId });
  const itemsTakenByUser = user.itemsTakenFromWebsite;

  try {
    // Check if the item exists
    const foundItem = await Item.findOne({ item_id: itemId });

    if (!foundItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    let updatedQuantity = 0;

    // store current value before any changes
    const previousItemQuantity = foundItem.quantity;
    console.log("previous", previousItemQuantity);

    // Check if there is an existing entry for the user and item
    const existingIssuedItem = await Issued.findOne({
      item_id: itemId,
      userID: userId,
    });

    if (existingIssuedItem) {
      // Update quantity if item is already issued
      updatedQuantity = existingIssuedItem.quantity + quantity;

      // Update the existing entry in the Issued database
      await Issued.findOneAndUpdate(
        { item_id: itemId, userID: userId },
        { quantity: updatedQuantity }
      );

      const itemToUpdateIndex = itemsTakenByUser.findIndex(
        (item) => item.item_id == itemId
      );

      if (itemToUpdateIndex !== -1) {
        // Update the quantity and updatedTime of the item
        itemsTakenByUser[itemToUpdateIndex].quantity = updatedQuantity;
        itemsTakenByUser[itemToUpdateIndex].updatedDate = getDate();

        // Update the user document in the database with the modified itemsTakenFromWebsite array
        await User.findOneAndUpdate(
          { userID: userId },
          { itemsTakenFromWebsite: itemsTakenByUser }
        );
      }

      res.status(200).json({
        status: 200,
        message: "Item quantity updated successfully",
        updatedQuantity: updatedQuantity,
      });
    } else {
      // Create new database entry
      const issued = await Issued.create({
        _id: new mongoose.Types.ObjectId(),
        quantity: quantity,
        item_id: itemId,
        userID: userId,
      });
      const issued2 = await Duplicated.create({
        _id: new mongoose.Types.ObjectId(),
        quantity: quantity,
        item_id: itemId,
        userID: userId,
      });

      const item = await Item.findOne({ item_id: itemId });

      const name = item.itemName;

      // Initialize updatedQuantity with the newly issued quantity
      updatedQuantity = { quantity: quantity };

      const itemToUpdateIndex = itemsTakenByUser.findIndex(
        (item) => item.item_id == itemId
      );

      if (itemToUpdateIndex !== -1) {
        const val = itemsTakenByUser[itemToUpdateIndex].quantity;
        const updatedQuantity = Number(val) + Number(quantity);

        itemsTakenByUser[itemToUpdateIndex].quantity = updatedQuantity;
        itemsTakenByUser[itemToUpdateIndex].updatedDate = getDate();

        await User.findOneAndUpdate(
          { userID: userId },
          { itemsTakenFromWebsite: itemsTakenByUser }
        );
      } else {
        const itemToAdd = {
          item_id: itemId,
          itemName: name,
          quantity: quantity,
          date: getDate(),
        };

        itemsTakenByUser.push(itemToAdd);

        await User.findOneAndUpdate(
          { userID: userId },
          { itemsTakenFromWebsite: itemsTakenByUser }
        );
      }

      res.status(200).json({
        status: 200,
        message: "Item issued successfully",
        issued: issued,
      });
    }

    const timeout = setTimeout(async () => {
      try {
        const updatedIssuedItem = await Issued.findOne({
          item_id: itemId,
          userID: userId,
        });

        if (!updatedIssuedItem || updatedIssuedItem.quantity === quantity) {
          await Issued.deleteMany({ userID: userId });
          console.log(
            `Issued documents for userId ${userId} deleted after 2 minutes`
          );

          // Calculate the updated quantity for the Item collection
          const updatedItemQuantity =
            previousItemQuantity + updatedQuantity.quantity;
          console.log(updatedItemQuantity);

          // Update the Item database with the updated quantity
          await Item.findOneAndUpdate(
            { item_id: itemId },
            { quantity: updatedItemQuantity }
          );
          console.log("Item quantity updated after  minutes");
        }
      } catch (error) {
        console.error(
          "Error deleting Issued documents or updating items:",
          error
        );
      }
    }, 10 * 60 * 1000);
  } catch (error) {
    console.error("Error issuing item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checked = async (req, res) => {
  const { userID } = req.body;

  try {
    const foundItems = await Issued.find({ userID: userID });

    if (!foundItems || foundItems.length === 0) {
      return res.status(404).json({
        message: "Items not found for the given userID",
      });
    }

    // Extracting only item_id and quantity from each found item
    const simplifiedItems = foundItems.map((item) => ({
      item_id: item.item_id,
      quantity: item.quantity,
    }));

    res.status(200).json(simplifiedItems);
  } catch (error) {
    console.error("Error during checking items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyUID = async (req, res) => {
  try {
    console.log("Received Request:", req.body);
    const { userID } = req.body;

    if (!userID) {
      throw new ApiError(400, "UID is required");
    }

    const user = await Issued.findOne({ userID });

    if (!user) {
      res.status(404).send("incorrect");
      console.log("inc");
      return;
    }

    res.status(200).send("correct");
    console.log("correct");
  } catch (error) {
    console.error("Error during UID verification:", error);
    res.status(200).json({ message: "Internal server error" });
  }
};

export const see = async (req, res) => {
  const { userID } = req.query;
  console.log("USERID", userID);

  if (!userID) {
    console.log("No user id");
    res.status(400).json("Provide a user id");
  } else {
    const user = await Issued.findOne({ userID: userID });

    const issuedItems = user.itemsTakenFromWebsite;

    console.log(issuedItems);

    const returnedItems = await ReturnItem.find({ userID: userID }).populate(
      "item_id"
    );

    // Send the response with the filtered items
    res.status(200).json({ issuedItems, returnedItems });
  }
};

export const invalid = async (req, res) => {
  const issueddate = getDate();

  const { userID, items } = req.body; // items is an array of objects with 'itemID' and 'quantity' fields
  console.log("Items received:", items);

  try {
    for (const item of items) {
      const { itemID, quantity } = item;
      console.log(`Processing itemID: ${itemID}, Quantity: ${quantity}`);
      const newquantity = await Item.findOne({ item_id: itemID });

      const foundItem = await Issued.findOne({ item_id: itemID });

      if (foundItem && foundItem.quantity < quantity) {
        // If quantity matches, delete the issued document and store it in returns document
        console.log("Greater than requested");

        const newItem = await ReturnItem.create({
          _id: new mongoose.Types.ObjectId(),
          userID: userID,
          item_id: itemID,
          quantity: quantity,
          issueDate: issueddate,
        });
        console.log("new item created");
        await Item.findOneAndUpdate(
          { item_id: itemID },
          {
            $set: {
              quantity: newquantity.quantity + foundItem.quantity - quantity,
            },
          }
        );
        await Issued.deleteOne({ userID: userID });

        console.log(`ItemID: ${itemID} processed successfully.`);
      } else if (foundItem && foundItem.quantity > quantity) {
        // If quantity matches, delete the issued document and store it in returns document
        console.log("Greater than requested");

        const newItem = await ReturnItem.create({
          _id: new mongoose.Types.ObjectId(),
          userID: userID,
          item_id: itemID,
          quantity: quantity,
          issueDate: issueddate,
        });
        console.log("new item created");
        await Item.findOneAndUpdate(
          { item_id: itemID },
          {
            $set: {
              quantity: newquantity.quantity + foundItem.quantity - quantity,
            },
          }
        );
        await Issued.deleteOne({ userID: userID });

        console.log(`ItemID: ${itemID} processed successfully.`);
      } else if (foundItem && foundItem.quantity === quantity) {
        // If quantity matches, delete the issued document and store it in returns document
        console.log("Quantity matches!");

        const newItem = await ReturnItem.create({
          _id: new mongoose.Types.ObjectId(),
          userID: userID,
          item_id: itemID,
          quantity: quantity,
          issueDate: issueddate,
        });
        await Item.findOneAndUpdate(
          { item_id: itemID },
          { $set: { quantity: newquantity.quantity } }
        );
        await Issued.deleteOne({ userID: userID });

        console.log(`ItemID: ${itemID} processed successfully.`);
      } else {
        console.log("Incorrect quantity or item not found");

        const item = await Item.findOne({ item_id: itemID });

        if (!item) {
          console.log(`Item with ID ${itemID} not found.`);
          continue;
        }

        // Check if the requested quantity is available
        if (item.quantity < quantity) {
          console.log(
            `Insufficient quantity for item with ID ${itemID}. Available: ${item.quantity}`
          );
          return;
        }

        // Update the quantity in the database by decrementing it
        await Item.findOneAndUpdate(
          { item_id: itemID },
          { $inc: { quantity: -quantity } }
        );

        const newItem = await ReturnItem.create({
          _id: new mongoose.Types.ObjectId(),
          userID: userID,
          item_id: itemID,
          quantity: quantity,
          issueDate: issueddate,
        });

        console.log(`ItemID: ${itemID} processed successfully.`);
      }
    }

    return res.status(200).json({ message: "Items processed successfully" });
  } catch (error) {
    console.error("Error during processing items:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const issueItem = async (req, res) => {
//   const { userId, itemId, quantity } = req.body;

//     const user = await User.findOne({ userID: userId });
//     const itemsTakenByUser = user.itemsTakenFromWebsite;

//     try {
//       // Check if the item exists
//       const foundItem = await Item.findOne({ item_id: itemId });

//       if (!foundItem) {
//         return res.status(404).json({
//           message: "Item not found",
//         });
//       }

//       let updatedQuantity = 0;

//       // store current value before any changes
//       const previousItemQuantity = foundItem.quantity;
//       console.log("previous", previousItemQuantity);

//       // Check if there is an existing entry for the user and item
//       const existingIssuedItem = await Issued.findOne({
//         item_id: itemId,
//         userID: userId,
//       });

//       if (existingIssuedItem) {
//         // Update quantity if item is already issued
//         updatedQuantity = existingIssuedItem.quantity + quantity;

//         // Update the existing entry in the Issued database
//         await Issued.findOneAndUpdate(
//           { item_id: itemId, userID: userId },
//           { quantity: updatedQuantity }
//         );

//         const itemToUpdateIndex = itemsTakenByUser.findIndex(
//           (item) => item.item_id == itemId
//         );

//         if (itemToUpdateIndex !== -1) {
//           // Update the quantity and updatedTime of the item
//           itemsTakenByUser[itemToUpdateIndex].quantity = updatedQuantity;
//           itemsTakenByUser[itemToUpdateIndex].updatedDate = getDate();

//           // Update the user document in the database with the modified itemsTakenFromWebsite array
//           await User.findOneAndUpdate(
//             { userID: userId },
//             { itemsTakenFromWebsite: itemsTakenByUser }
//           );
//         }

//         res.status(200).json({
//           status: 200,
//           message: "Item quantity updated successfully",
//           updatedQuantity: updatedQuantity,
//         });
//       } else {
//         // Create new database entry
//         const issued = await Issued.create({
//           _id: new mongoose.Types.ObjectId(),
//           quantity: quantity,
//           item_id: itemId,
//           userID: userId,
//         });
//         const item = await Item.findOne({ item_id: itemId });

//         const name = item.itemName;

//         // Initialize updatedQuantity with the newly issued quantity
//         updatedQuantity = { quantity: quantity };

//         const itemToUpdateIndex = itemsTakenByUser.findIndex(
//           (item) => item.item_id == itemId
//         );

//         if (itemToUpdateIndex !== -1) {
//           const val = itemsTakenByUser[itemToUpdateIndex].quantity;
//           const updatedQuantity = Number(val) + Number(quantity);

//           itemsTakenByUser[itemToUpdateIndex].quantity = updatedQuantity;
//           itemsTakenByUser[itemToUpdateIndex].updatedDate = getDate();

//           await User.findOneAndUpdate(
//             { userID: userId },
//             { itemsTakenFromWebsite: itemsTakenByUser }
//           );
//         } else {
//           const itemToAdd = {
//             item_id: itemId,
//             itemName: name,
//             quantity: quantity,
//             date: getDate(),
//           };

//           itemsTakenByUser.push(itemToAdd);

//           await User.findOneAndUpdate(
//             { userID: userId },
//             { itemsTakenFromWebsite: itemsTakenByUser }
//           );
//         }

//         res.status(200).json({
//           status: 200,
//           message: "Item issued successfully",
//           issued: issued,
//         });
//       }

//     } catch (error) {
//       console.error("Error issuing item:", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   };

//   // Save the issued item to the database
//   const issuedItem = new Issued({
//     userID: userID,
//     item_id: item_id,
//     quantity: quantity,
//   });

//   try {
//     const result = await issuedItem.save();
//     res.status(201).json(result);
//   } catch (error) {
//     console.error("Error saving issued item:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
export const getIssuedItems = async (req, res) => {
  try {
    const issuedItems = await Duplicated.find();
    console.log(issuedItems);
    res.status(200).json(issuedItems);
  } catch {
    console.log("Error fetching issued items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getReturnedItems = async (req, res) => {
  try {
    const returnedItems = await ReturnItem.find();
    res.status(200).json(returnedItems);
  } catch (error) {
    console.error("Error fetching returned items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
