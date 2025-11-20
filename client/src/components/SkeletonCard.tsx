// client/src/components/SkeletonCard.tsx
import "./Skeleton.css"; // <--- 待会儿我们会创建这个 CSS 文件

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      {/* 视频占位区 */}
      <div className="skeleton-video"></div>
      {/* 信息占位区 */}
      <div className="skeleton-info">
        {/* 头像占位 */}
        <div className="skeleton-avatar"></div>
        {/* 文本占位 */}
        <div className="skeleton-text"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
