import userrouter from "./modules/user/user.contoller.js";
import authrouter from "./modules/auth/auth.controller.js"
import postrouter from "./modules/post/post.controller.js"
import chatrouter from "./modules/chat/chat.controller.js"
import connectDb from "./DB/connection.js";
import commentrouter from "./modules/comment/comment.controller.js"
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";

  const bootstrap=async(app,express)=>{
app.use(express.json());
await connectDb();
app.get("/",(req,res)=>res.json("hellow world"));
//app.use("/uploads",express.statik("uploads"));
const whitelist=["http://localhosr:500"];
//app.use(cors())
app.use((req,res,next)=>{
  if(!whitelist.includes(req.header("origin"))){return next("blockes by cors")

  }
  res.header("Access-Control-Allow-Origin",req.header("origin"));
    res.header("Access-Control-Allow-Methods","*")
  res.header("Access-Control-Allow-Headers","*")
  res.header("Access-Control-Private-Network",true)
return next();
})
const limiter = rateLimit({
windowMs: 5 * 60 * 1000,
limit: 3,
message:"to many request fromthis ip please try again after 5 minute"
  });
  app.use(helmet())
app.use(limiter);
app.use("/user",userrouter);
app.use("/auth",authrouter);
app.use("/post",postrouter);
app.use("/chat",chatrouter)

app.all("*",(req,res)=>{res.status(404).json({message:"invalid handler"})})

app.use((error,req,res)=>{
  return res.status(error.cause).json({success:false,message:error.message,stack:error.stack})})
};







export default bootstrap;
0