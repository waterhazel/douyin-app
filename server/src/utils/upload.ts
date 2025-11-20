// server/src/utils/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// 1. 确保存放文件的文件夹存在
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 2. 配置存储策略
const storage = multer.diskStorage({
  // 存到哪：项目根目录下的 uploads 文件夹
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  // 叫什么：时间戳 + 随机数 + 后缀名 (防止重名)
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // 获取后缀 (如 .mp4)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// 3. 导出配置好的 upload 工具
export const upload = multer({ storage: storage });
