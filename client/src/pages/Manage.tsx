import { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal, Form, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const Manage = () => {
  const [videos, setVideos] = useState<any[]>([]);

  // --- 新增：控制弹窗的状态 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null); // 当前正在编辑的视频
  const [form] = Form.useForm(); // 获取表单实例

  // 加载列表
  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:3000/api/videos");
    setVideos(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // 删除逻辑
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/videos/${id}`);
      message.success("删除成功");
      fetchVideos();
    } catch (error) {
      message.error("删除失败");
    }
  };

  // --- 新增：点击编辑按钮 ---
  const handleEditClick = (record: any) => {
    setCurrentVideo(record); // 记住当前点的是哪一行
    form.setFieldsValue({
      // 把原来的标题和简介填进表单里
      title: record.title,
      description: record.description,
    });
    setIsModalOpen(true); // 打开弹窗
  };

  // --- 新增：提交编辑 ---
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields(); // 获取表单输入

      // 发送请求给后端
      await axios.put(
        `http://localhost:3000/api/videos/${currentVideo.id}`,
        values,
      );

      message.success("修改成功");
      setIsModalOpen(false); // 关弹窗
      fetchVideos(); // 刷新列表
    } catch (error) {
      message.error("修改失败");
    }
  };

  const columns = [
    {
      title: "封面",
      dataIndex: "videoUrl",
      key: "cover",
      render: (url: string) => (
        <video
          src={url}
          style={{
            width: 100,
            height: 60,
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      ),
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "简介", // 把简介也显示出来方便看
      dataIndex: "description",
      key: "description",
      ellipsis: true, // 文字太长自动省略
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 10 }}>
          {/* 编辑按钮 */}
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            编辑
          </Button>

          {/* 删除按钮 */}
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(record.id)}
            okText="删！"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 内容管理</h2>
      <Table
        dataSource={videos}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* --- 新增：编辑弹窗 --- */}
      <Modal
        title="编辑视频信息"
        open={isModalOpen}
        onOk={handleEditSubmit} // 点击确定时触发
        onCancel={() => setIsModalOpen(false)} // 点击取消时关闭
        okText="保存修改"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "标题不能为空" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="简介" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Manage;
