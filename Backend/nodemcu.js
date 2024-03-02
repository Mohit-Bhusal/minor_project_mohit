import express from "express";
import  bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/send-data", (req, res) => {
  const dataFromESP8266 = req.body;
  // Process the received data as needed
  console.log("Data received from ESP8266:", dataFromESP8266);
  res.send("Data received successfully");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
