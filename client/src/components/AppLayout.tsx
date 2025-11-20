// client/src/components/AppLayout.tsx
import { Layout, Menu, Button, message } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  CloudUploadOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 处理菜单点击
  const handleMenuClick = (e: any) => {
    if (e.key === "home") navigate("/");
    if (e.key === "publish") navigate("/publish");
  };

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem("token"); // 撕毁通行证
    localStorage.removeItem("user");
    message.success("已退出登录");
    navigate("/login"); // 踢回登录页
  };

  // 确定当前选中的是哪个菜单 (为了高亮显示)
  const selectedKey = location.pathname === "/publish" ? "publish" : "home";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 顶部导航栏 */}
      <Header
        style={{ display: "flex", alignItems: "center", padding: "0 20px" }}
      >
        <div
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            marginRight: 30,
          }}
        >
          Douyin Lite 🎵
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            { key: "home", icon: <HomeOutlined />, label: "首页" },
            { key: "publish", icon: <CloudUploadOutlined />, label: "发视频" },
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />

        <Button
          type="text"
          style={{ color: "white" }}
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          退出
        </Button>
      </Header>

      {/* 内容区域：Outlet 就是“变动的那个页面” */}
      <Content style={{ padding: "20px 50px", backgroundColor: "#f0f2f5" }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
