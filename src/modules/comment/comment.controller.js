import{ Router} from "express";

import * as commentservices from "./comment.services.js"
import { asyncHandler } from "../../../utlis/error_handling/asyncHandler.js";
import { authentication } from "../../middlewares/auth.middellwer.js";
import { validation } from "../../middlewares/validation.middlewares.js";
import { createcommentSchema, updateCommentSchema ,sofDeleteCommentSchema,likeorunlikeSchema, replaySchema} from "./comment.validation.js";
import { uploadCloud } from "../../../utlis/file uploading/multerCloud.js";
const router=Router({mergeParams:true});
router.post("/creatcomment",
    authentication(),
    uploadCloud().single("image"),
  validation(createcommentSchema),
    asyncHandler(commentservices.creteComment));
    ///////////////////////////////////////////////////////////////////
router.patch("/updatecomment/:commentId",
    authentication(),
uploadCloud().single("image"),
validation(updateCommentSchema),
asyncHandler(commentservices.updateComment))
///////////////////////////////////////////////////////////
router.patch("/softdelet/:commentId",
authentication(),
validation(sofDeleteCommentSchema),
asyncHandler(commentservices.softdeleteComment)
)
//////////////////////////////////////////////////////////
router.get("/",
    authentication(),
    asyncHandler(commentservices.getAllComment)
)
///////////////////////////////////////////////////////////
router.patch("/likeorunlike/:commentId",
    authentication(),
//validation(likeorunlikeSchema),
asyncHandler(commentservices.likeUnlike)
)
///////////////////////////////////////////////////////////
router.post("/replay/:commentId",
    authentication(),
    uploadCloud().single("image"),
   // validation(replaySchema),
    asyncHandler(commentservices.replay)
)
router.delete("delete/:commentId",
    authentication(),
    asyncHandler(commentservices.deleteComment)
)
 export default router;