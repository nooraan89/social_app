

import mongoose, { Schema, Types ,model} from "mongoose";
const postSchema=new Schema({
content:{type:String,minlength:2,maxlength:5000,trim:true,
    required:function(){
     return   this.image?.length?false:true;
    }
},
images:[{secure_url:String,public_id:String}],
createdBy:{type:Types.ObjectId,ref:"User",trime:true,required:true},
deleteBy:{type:Types.ObjectId,ref:"User"},
likes:[{type:Types.ObjectId,ref:"User"}],
isDeleted:{type:Boolean,default:false},
customId:{type:String,uniqe:true}
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true
}})
postSchema.query.paginet=async function(page){
    
    page =page?page:1;
    const {limit}=5;
    const{skip}=limit*(page-1);

const data=await this.skip(skip).limit(limit);
const items=await this.model.countDocument();
return {data ,
    totalItemes:items,
    cuurentPage:Number(page),
    totalPages:Math.ceil(items/limit),
    itemPerPage:data.length

}

};
postSchema.virtual("comments",{
ref:"Comment",
foreignField:"postId",
localField:"_id"
});
export const PostModel= mongoose.model.Post||model("post",postSchema)
