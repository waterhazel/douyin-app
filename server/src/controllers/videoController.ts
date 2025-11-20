// server/src/controllers/videoController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 发布视频
export const createVideo = async (req: Request, res: Response) => {
  try {
    // 1. 检查有没有文件
    if (!req.file) {
      res.status(400).json({ error: "请上传视频文件" });
      return;
    }

    // 2. 获取文本数据 (标题、简介)
    const { title, description } = req.body;
    // 注意：req.user 是我们在中间件里塞进去的用户信息 (后面会讲，先假设有)
    // 暂时我们要从 body 里硬传一个 authorId，或者稍后为了测试先写死
    // 为了让你先跑通，我们这里先“作弊”，假设发视频的是 ID=1 的用户 (Day 2 脚本创建的那个 zhangsan)
    // 等下个阶段我们再加上真正的 Token 验证
    const authorId = 1;

    // 3. 生成可访问的 URL
    // 比如文件被存成了 uploads/video-123.mp4
    // 访问地址就是 http://localhost:3000/uploads/video-123.mp4
    const videoUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    // 4. 存入数据库
    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        authorId: Number(authorId), // 确保是数字
      },
    });

    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "发布视频失败" });
  }
};

// 获取视频列表 (顺手写了，方便等下测试)
export const getVideos = async (req: Request, res: Response) => {
  const videos = await prisma.video.findMany({
    include: { author: true }, // 把作者信息也查出来
    orderBy: { createdAt: "desc" }, // 按时间倒序
  });
  res.json(videos);
};
