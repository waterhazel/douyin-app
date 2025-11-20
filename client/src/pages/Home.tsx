import { useEffect, useState } from "react";
import { Card, Typography, Avatar, message } from "antd";
import { UserOutlined, HeartOutlined } from "@ant-design/icons";
import axios from "axios";
import Masonry from "react-masonry-css";
import "./Home.css"; // <--- 引入刚才写的 CSS
import SkeletonCard from "../components/SkeletonCard";

const { Meta } = Card;

const Home = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 定义响应式列数：屏幕大显示3列，屏幕小显示2列
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true); // <--- 请求开始，显示骨架屏
      try {
        const res = await axios.get("http://localhost:3000/api/videos");
        setVideos(res.data);
      } catch (error) {
        message.error("获取视频列表失败");
      } finally {
        // <--- 无论成功失败，都在这里结束加载状态
        // 假装延迟 1 秒，为了演示骨架屏效果给老师看
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <Typography.Title
        level={3}
        style={{ marginBottom: 20, textAlign: "center" }}
      >
        🔥 热门推荐
      </Typography.Title>

      {/* --- 核心逻辑：三元表达式 (Condition ? True : False) --- */}
      {loading ? (
        // ============================================================
        // 情况 A: 正在加载中 (Loading) -> 显示骨架屏
        // ============================================================
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* 循环生成 6 个假的占位卡片，模拟数据正在加载的样子 */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{ width: "30%", minWidth: "300px", flexGrow: 1 }}
            >
              {/* 调用我们刚才手写的骨架组件 */}
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : (
        // ============================================================
        // 情况 B: 加载完成 (Done) -> 显示真正的瀑布流数据
        // ============================================================
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {/* 遍历后端返回的真实视频数据 */}
          {videos.map((item) => (
            <div key={item.id}>
              <Card
                className="video-card"
                hoverable
                cover={
                  <video
                    src={item.videoUrl}
                    controls
                    preload="metadata"
                    style={{
                      width: "100%",
                      display: "block",
                      backgroundColor: "#000",
                    }}
                  />
                }
                actions={[
                  <div key="like" style={{ color: "#666" }}>
                    <HeartOutlined /> 1.2w
                  </div>,
                  <div key="user" style={{ fontSize: 12 }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>,
                ]}
              >
                <Meta
                  avatar={
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#f56a00" }}
                    />
                  }
                  title={item.title}
                  description={
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.description || "暂无简介"}
                    </div>
                  }
                />
              </Card>
            </div>
          ))}
        </Masonry>
      )}
      {/* --- 逻辑结束 --- */}
    </div>
  );
};

export default Home;
