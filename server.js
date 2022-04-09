import express from "express";
import connectDB from "./database/dbconnection.js";
import router from "./router/registerRoute.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
connectDB;

app.use(cors());

app.use(express.json());

app.use(router);

app.get("/", (req,res) => {
  res.status(200).send("Welcome to Green wavers api")
});

app.get("*", (req, res) => {
  res.status(404).send("Page not Found")
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


