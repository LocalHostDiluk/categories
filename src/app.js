import bodyParser from "body-parser";
import express from "express";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.use(bodyParser.json());
app.use("/app/categories", categoriesRoutes);

export default app;
