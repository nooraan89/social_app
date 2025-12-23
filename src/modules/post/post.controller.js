import { asyncHandler } from "../../../utlis/error_handling/asyncHandler.js";
import { authentication } from "../../middlewares/auth.middellwer.js";
import * as  postServices from "../post/post.services.js";
import { uploadCloud } from "../../../utlis/file uploading/multerCloud.js";
import {Router}from "express";
import { validation } from "../../middlewares/validation.middlewares.js";
import commentrouter from "../comment/comment.controller.js"
import { creatPostSchema, updateSchema ,deletePostSchema, getPostSchema, likePostSchema} from "./post.validation.js";
const router=Router({caseSensitive:true});
router.post("/creat",
    authentication(),
    uploadCloud().array("images"),
    validation(creatPostSchema),
    asyncHandler(postServices.creatPost))
    router.patch("/:postId",
        authentication(),
        uploadCloud().array("images"),
        validation(updateSchema),
        asyncHandler(postServices.updatePost)
    )
    router.patch("/delete/:postId",
        authentication(),
        validation(deletePostSchema),
       asyncHandler( postServices.deletePost)
    )
   router.get("/getpost/:postId",
        authentication(),
        validation(getPostSchema),
        asyncHandler(postServices.getPost)
)
    router.get("/activepost",
        authentication(),
   
  asyncHandler(postServices.activePost))
 router.get("/freezpost",
        authentication(),
    asyncHandler(postServices.unactivePost))
router.post("/likepost/:postId",
    authentication(),
    validation(likePostSchema),
    asyncHandler(postServices.likePost)
)
router.use("/:postId/comment",commentrouter)
 router.get("/getallposts",
        authentication(),
   
  asyncHandler(postServices.getAllPosts))


export default router;