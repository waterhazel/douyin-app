import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 注册接口逻辑
export const register = async (req: Request, res: Response) => {
  try {
    // 1. 从前端请求里拿数据
    const { username, password } = req.body;

    // 2. 简单的校验
    if (!username || !password) {
      res.status(400).json({ error: "用户名和密码必填" });
      return; // 必须 return 结束函数
    }

    // 3. 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      res.status(400).json({ error: "用户名已存在" });
      return;
    }

    // 4. 创建新用户 (注意：实际开发中密码必须加密，这里先存明文跑通流程)
    const user = await prisma.user.create({
      data: {
        username,
        password, // 暂时明文
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      },
    });

    // 5. 返回成功信息
    res.status(201).json({
      message: "注册成功！",
      user: { id: user.id, username: user.username, avatar: user.avatar },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "服务器出错了" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 1. 找人：看看数据库里有没有这个用户
    const user = await prisma.user.findUnique({ where: { username } });

    // 2. 核对：用户不存在，或者密码不对 (这里暂时是明文比较)
    if (!user || user.password !== password) {
      res.status(400).json({ error: "用户名或密码错误" });
      return;
    }

    // 3. 发证：生成一个 JWT Token (通行证)
    // 这个 token 里藏着用户的 id，有效期 24 小时
    const token = jwt.sign({ userId: user.id }, "SECRET_KEY", {
      expiresIn: "24h",
    });

    // 4. 返回成功信息和 Token
    res.json({
      message: "登录成功！",
      token,
      user: { id: user.id, username: user.username, avatar: user.avatar },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "服务器出错了" });
  }
};
