// item.routes.js
import express from "express";
import {
  getItems,
  updateQuantity,
  addTotal,
  verifyUID,
  checked,
  see,
  invalid,
} from "./item_controller.js";

const ItemRouter = express.Router();

ItemRouter.route("/getItems").get(getItems);
ItemRouter.route("/updateQuantity").post(updateQuantity);
ItemRouter.route("/addTotal").post(addTotal);
ItemRouter.route("/checked").post(checked);
ItemRouter.route("/verifyUID").post(verifyUID);
// ItemRouter.route("/taken").post(taken);
ItemRouter.route("/invalid").post(invalid);
ItemRouter.route("/see").get(see);
// ItemRouter.route("/revertQuantities").post(revertQuantities);

export default ItemRouter;
