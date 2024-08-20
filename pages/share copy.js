// pages/share.js
import Head from "next/head";
import { useState, useEffect } from "react";

export default function Share() {
  const [works, setWorks] = useState([]);

  // 从数据库或 API 获取作品列表
  useEffect(() => {
    const fetchWorks = async () => {
      // 这里你需要实现从数据库或 API 获取作品列表的逻辑
      // 例如：
      // const response = await fetch('/api/works');
      // const data = await response.json();
      // setWorks(data);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 这里将循环展示作品列表 */}
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </div>
    </>
  );
}

// 作品卡片组件
const WorkCard = ({ work }) => {
  return (
    <div className="border rounded-md p-4 shadow-md">
      {/* 这里可以展示作品截图、标题、作者等信息 */}
      <img src={work.screenshot} alt={work.title} className="w-full h-48 object-cover rounded-md mb-2" />
      <h2 className="text-lg font-medium">{work.title}</h2>
      <p className="text-gray-600 text-sm">作者: {work.author}</p>
      {/* 添加链接到作品详情页 */}
      <a href={`/work/${work.id}`} className="text-blue-500 hover:underline">查看作品</a>
    </div>
  );
};
