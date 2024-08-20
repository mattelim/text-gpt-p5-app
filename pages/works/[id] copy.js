// pages/work/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function WorkDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [work, setWork] = useState(null);

  useEffect(() => {
    const fetchWork = async () => {
      // 根据作品 ID 从数据库或 API 获取作品数据
      // 例如：
      // const response = await fetch(`/api/works/${id}`);
      // const data = await response.json();
      // setWork(data);
    };

    if (id) {
      fetchWork();
    }
  }, [id]);

  if (!work) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{work.title}</h1>
      <img src={work.screenshot} alt={work.title} className="w-full h-96 object-cover rounded-md mb-4" />
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{work.code}</pre>
      {/* 添加播放作品的逻辑 */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        播放作品
      </button>
    </div>
  );
};
