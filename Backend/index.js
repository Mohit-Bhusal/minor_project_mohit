import connectDB from "./db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import "dotenv/config";

import userRouter from "./user.routes.js";

import router from "./user.routes.js";
import ItemRouter from "./items.route.js";
import express from "express";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin:"http://localhost:5173",
    credentials:true
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT;

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Listening at port:", port);
  });
});

app.get("/", (req, res) => {
  res.send("Running");
});
app.get("/users/signin", (req, res) => {
  res.send("Running");
});

app.get("/users/verifyUID", (req, res) => {
  res.send("VERIFY UID");
});
app.get("/items/addTotal", (req, res) => {
  res.send("working");
});

// app.get("/users/getItems", (req, res) => {
//   res.send("okay");
// });

app.use("/users", userRouter);
app.use(router);

app.use("/items", ItemRouter);

// app.get("/items/updateQuantity",(req,res)=>{
//   res.send("hi")
// })

