import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = 3000;

// 1. 中间件配置
app.use(cors()); // 允许跨域 (让前端能访问)
app.use(express.json()); // 允许解析 JSON 格式的请求体 (关键！)

// 2. 注册路由
app.use("/api/auth", authRoutes);

// 3. 启动服务
app.listen(port, () => {
  console.log(`🚀 服务已启动：http://localhost:${port}`);
});
