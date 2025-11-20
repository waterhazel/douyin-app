import { useEffect, useState } from "react";
import { Card, List, Typography } from "antd";
import axios from "axios";

const Home = () => {
  const [videos, setVideos] = useState<any[]>([]);

  // 页面加载时，自动去后端抓取视频数据
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/videos");
        setVideos(res.data);
      } catch (error) {
        console.error("获取视频失败", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <Typography.Title level={2}>📺 视频列表</Typography.Title>

      <List
        grid={{ gutter: 16, column: 1 }} // 每一行放 1 个视频
        dataSource={videos}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title} hoverable>
              {/* 视频播放器 */}
              <video
                src={item.videoUrl}
                controls
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  backgroundColor: "#000",
                }}
              />
              <p style={{ marginTop: 10, color: "#666" }}>{item.description}</p>
              <p style={{ fontSize: 12, color: "#999" }}>
                作者ID: {item.authorId} | 发布时间:{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Home;
