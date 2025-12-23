import {Schema, Types} from "mongoose";
import mongoose from  "mongoose"
import { rolestype } from "../../middlewares/auth.middellwer.js";

const userSchema = new Schema({
    username:{
    type:String,
    required:[true,"user name is required"],
    minleangth:[3,"user name most be at least 3 character long"],
    maxleangth:[20,"user name most be at most 20 character long"],
    trim:true,
},
email:{
type:String,
unique:[true,"email must be unique"],
required:[true,"emai is required "],
lowercase:true,
match:/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/,
},
password:{
    type:String,
    required:[true,"pasword is required"],
},
gender:{
    type:String,
    enum :{
    values:["male","female"],
    message:"gender must by either male",
    default :"male",
          }
     },
isConfirmed:{

    type:Boolean,
    default:"false",
},
role:{
type:String,
enum:Object.values([rolestype]),
default:"user"
},
Dob:String,
image:String,
phone:String,
isdeleted:{
   type: Boolean,
   default:false
},
confirmEmailotb:String,
forgetEmailotb:String,
updateEmailotb:String,
changedAt:Date,
friendRequest:[{type:Types.ObjectId,ref:"User"}],
frinds:[{type:Types.ObjectId,ref:"User"}]

},
{timestamps:true}

);
const UserModel=mongoose.model("User",userSchema);
export default UserModel;