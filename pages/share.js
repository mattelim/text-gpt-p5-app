// pages/share.js
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from 'next/link'; // 引入 Link 组件
export default function Share() {
  const [works, setWorks] = useState([]);

  // 从数据库或 API 获取作品列表
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('/api/works'); // 替换为你的 API 路径
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWorks(data);
      } catch (error) {
        console.error("获取作品列表失败:", error);
        // 可以在这里处理错误，例如显示错误信息给用户
      }
    };

    fetchWorks();
  }, []);

  return (
    <>
      <Head>
        <title>作品分享 - 斯内克 AI 创意编程</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">作品分享</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          主页
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {works.length > 0 ? (
            works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))
          ) : (
            <p>加载中...</p>
          )}
        </div>
      </div>
    </>
  );
}

// 作品卡片组件
const WorkCard = ({ work }) => {
  return (
    <div className="border rounded-md p-4 shadow-md">
      <img
        src={work.screenshot}
        alt={work.title}
        className="w-full h-48 object-cover rounded-md mb-2"
      />
      <h2 className="text-lg font-medium">{work.title}</h2>
      <p className="text-gray-600 text-sm">作者: {work.author}</p>
      <a href={`/works/${work.id}`} className="text-blue-500 hover:underline">
        查看作品{work.id}
      </a>
    </div>
  );
};

 