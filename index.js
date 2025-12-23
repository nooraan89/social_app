import express from "express";
import dotenv from "dotenv";
import bootstrap from "./src/app.controller.js";
const app=express();
dotenv.config({path:"./src/config/.env"});
await bootstrap(app,express);
const port=5000;
app.listen(port,()=>console.log("server is running on port 5000"))