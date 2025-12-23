
import mongoose, { Schema, Types ,model} from "mongoose";
const commentSchema=new Schema({
text:{type:String,minlength:2,maxlength:5000,trim:true,
    required:function(){return this.image?.length?false:true;}
},
image:{secure_url:String,public_id:String},
createdBy:{type:Types.ObjectId,ref:"User",trime:true,required:true},
deleteBy:{type:Types.ObjectId,ref:"User"},
likes:[{type:Types.ObjectId,ref:"User"}],
parentComment:[{type:Types.ObjectId,ref:"coment"}],
isDeleted:{type:Boolean,default:false},
postId:{type:Types.ObjectId,ref:"Post"}
},{timestamps:true})
const CommentModel= mongoose.model("Comment",commentSchema);
export default CommentModel;