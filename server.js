import express from "express";
import connectDB from "./database/dbconnection.js";
import router from "./router/registerRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
connectDB;

app.use(express.json());

app.use(router);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


