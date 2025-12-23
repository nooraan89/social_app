//import mongoose from"mongoose";
import mongoose from "mongoose"

async function connectDb() {
    try{
  await mongoose.connect("mongodb+srv://noor123:mnlsa1234@cluster0.ci6h6qa.mongodb.net/social");
console.log("connected to db")  
}catch{
console.log("cannot connect db")



  }}
  export default connectDb;