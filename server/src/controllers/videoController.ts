// server/src/controllers/videoController.ts
import fs from "fs";
import path from "path";
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

// 获取视频列表 (支持搜索 + 排序)
export const getVideos = async (req: Request, res: Response) => {
  try {
    // 1. 多接收一个 sort 参数
    const { keyword, sort } = req.query;

    const whereCondition = keyword
      ? {
          OR: [
            { title: { contains: String(keyword) } },
            { description: { contains: String(keyword) } },
          ],
        }
      : {};

    // 2. 决定排序方式 (默认是 desc 倒序)
    const orderByCondition =
      sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    const videos = await prisma.video.findMany({
      where: whereCondition,
      include: { author: true },
      orderBy: orderByCondition, // <--- 应用排序
    });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "获取视频失败" });
  }
};

// 删除视频 (包含物理文件删除)
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. 先去数据库查一下这个视频的信息 (为了拿到文件名)
    const video = await prisma.video.findUnique({
      where: { id: Number(id) },
    });

    if (!video) {
      res.status(404).json({ error: "视频不存在" });
      return;
    }

    // 2. 尝试删除本地文件
    try {
      // video.videoUrl 长这样: http://localhost:3000/uploads/video-123.mp4
      // 我们用 path.basename 提取出最后的文件名: "video-123.mp4"
      const filename = path.basename(video.videoUrl);

      // 拼凑出文件的绝对路径
      const filepath = path.join(__dirname, "../../uploads", filename);

      // 如果文件真的存在，就狠狠地删掉它！
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (err) {
      console.error("物理文件删除失败，可能是文件本来就不见了:", err);
      // 即使文件删除失败，我们通常也继续往下删数据库记录，防止死循环
    }

    // 3. 最后删除数据库记录
    await prisma.video.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "删除成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "删除失败" });
  }
};

// 更新视频信息
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedVideo = await prisma.video.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
      },
    });

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: "更新失败" });
  }
};
