import { model } from "mongoose"
import UserModel from "./models/user.model.js"
import CommentModel from "./models/comment.model.js"
export const create=async({model,data={}})=>{
  return  await model.create(data)

}
export const find=async({
    model,
    data={},
  select="",
  populate=[],
  skip=0,
  limit=1000,
})=>{
    return await model.find(data)
    .select(select)
    .populate(populate)
    .skip(skip).
    limit(limit);
    
}

export const findOne=async({
    model,
    data={},
    select="",
    populate=[],
})=>{
    return await model
    .findOne(data)
    .select(select)
    .populate(populate)

}
export const findById=async({
    model,
    id="",
    select="",
    populate=[]})=>{
    return await model
    .findById(id)
    .select(select)
    .populate(populate);

}
export const findByIdAndUpdate=async({
    model,
    id="",
    data={},
    options={},
    select="",
    populate=[]})=>{
    return await model
    .findByIdAndUpdate(id,data,options)
    .select(select)
    .populate(populate);

}
export const findOneAndUpdate=async({
    model,
    filter={},
    data={},
    options={},
    select="",
    populate=[]})=>{
return await model
.findOneAndUpdate(filter,data,options)
.select(select)
.populate(populate)

}
export const updateOne=async({
    model,
    filter={},
    data={},
    options={}})=>{
    return await model
    .updateOne(filter,data,options)};

    export const updateMany=async({
        model,
        filter={},
        data={},
        options={}
    })=>{
        return await model
        .updateMany({filter,data,options})};

    export const findByIdAndDeleted =async({
        model,
        id="",})=>{

return await model.findByIdAndDeleted(id);

    }
    export const findeOneAndDelete=async({model,filter={}})=>{
return await model.findeOneAndDelete(filter) 

    }
    export const deletOne=async({filter})=>{
  return await model.deletOne(filter)

    }
