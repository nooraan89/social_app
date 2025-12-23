

import mongoose ,{Schema,Types}from "mongoose";
const messageSchema=new Schema({
sender:{type:Types.ObjectId,ref:"User"},
content:{type:String,required:true}



},{timestamps:true})
const chatSchema=new Schema({

users:{
type:[{type:Types.ObjectId,ref:"User"}],
validat:{validator:(value)=>{value.length===2}},

},
messages:[messageSchema],


},{timestamps:true});
const ChatModel=mongoose.model("Chat",chatSchema);
export default ChatModel;
