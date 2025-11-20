// client/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Publish from "./pages/Publish";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 登录页 (独立页面，没有导航栏) */}
        <Route path="/login" element={<Login />} />

        {/* 2. 内部页面 (套在 AppLayout 里面) */}
        <Route path="/" element={<AppLayout />}>
          {/* index 表示默认显示的子页面 (首页) */}
          <Route index element={<Home />} />
          <Route path="publish" element={<Publish />} />
        </Route>

        {/* 3. 如果乱输地址，自动跳回首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
