import { Router } from "express";
import { createVideo, getVideos } from "../controllers/videoController";
import { upload } from "../utils/upload";

const router = Router();

// upload.single('video') 的意思是：
// 接收一个叫 'video' 字段的文件，并自动保存
router.post("/", upload.single("video"), createVideo);

router.get("/", getVideos);

export default router;
