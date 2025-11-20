import { useEffect, useState } from "react";
import { Card, Typography, Avatar, message } from "antd";
import { UserOutlined, HeartOutlined } from "@ant-design/icons";
import axios from "axios";
import Masonry from "react-masonry-css";
import "./Home.css"; // <--- 引入刚才写的 CSS

const { Meta } = Card;

const Home = () => {
  const [videos, setVideos] = useState<any[]>([]);

  // 定义响应式列数：屏幕大显示3列，屏幕小显示2列
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/videos");
        setVideos(res.data);
      } catch (error) {
        message.error("获取视频列表失败");
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

      {/* 瀑布流组件 */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {videos.map((item) => (
          <div key={item.id}>
            <Card
              className="video-card"
              hoverable
              cover={
                // 这里直接用 video 标签当封面
                <video
                  src={item.videoUrl}
                  controls
                  preload="metadata" // 预加载第一帧画面
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
    </div>
  );
};

export default Home;
