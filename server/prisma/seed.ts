// server/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. 往数据库里插入一个“张三”
  const user = await prisma.user.create({
    data: {
      username: "zhangsan",
      password: "password123", // 暂时存明文，后面再加密
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan", // 生成一个随机头像
    },
  });

  console.log("🎉 成功创建了一个用户：", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
