import { useEffect, useState } from "react";
import { Card, Typography, Avatar, message, Input, Select } from "antd";
import { UserOutlined, HeartOutlined } from "@ant-design/icons";
import axios from "axios";
import Masonry from "react-masonry-css";
import "./Home.css";
import SkeletonCard from "../components/SkeletonCard";

const { Meta } = Card;

const Home = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentKeyword, setCurrentKeyword] = useState(""); // <--- 新加状态

  // --- 1. 这里是刚才丢失的配置 ---
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  // 增加 sort 参数，默认 'newest'
  const fetchVideos = async (keyword = "", sort = "newest") => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/videos", {
        params: { keyword, sort }, // 发送给后端
      });
      setVideos(res.data);
    } catch (error) {
      message.error("获取视频列表失败");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // --- 3. 初始加载 ---
  useEffect(() => {
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

      {/* 搜索栏容器 */}
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto 30px auto",
          display: "flex",
          gap: 10,
        }}
      >
        <Input.Search
          placeholder="输入标题或简介搜索..."
          enterButton="搜索"
          size="large"
          onSearch={(value) => {
            setCurrentKeyword(value);
            fetchVideos(value, "newest");
          }}
          allowClear
          style={{ flex: 1 }}
        />

        <Select
          defaultValue="newest"
          size="large"
          style={{ width: 120 }}
          onChange={(value) => fetchVideos(currentKeyword, value)} // 切换排序时，带上当前的关键词
          options={[
            { value: "newest", label: "最新发布" },
            { value: "oldest", label: "最早发布" },
          ]}
        />
      </div>

      {loading ? (
        // 加载中：显示骨架屏
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{ width: "30%", minWidth: "300px", flexGrow: 1 }}
            >
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : (
        // 加载完成：显示瀑布流
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
                    <HeartOutlined /> {Math.floor(Math.random() * 1000)}
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
    </div>
  );
};

export default Home;
