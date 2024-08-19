// pages/api/works.js

import { connectToDatabase } from '../../utils/db'; // 替换为你的数据库连接方法

export default async function handler(req, res) {
  const { method } = req;
  const db = await connectToDatabase(); // 连接到数据库
  const collection = db.collection('works'); // 获取作品集合

  switch (method) {
    case 'GET':
      // 获取作品列表
      try {
        const works = await collection.find({}).toArray(); // 获取所有作品
        res.status(200).json(works);
      } catch (error) {
        res.status(500).json({ message: '获取作品列表失败' });
      }
      break;

    case 'POST':
      // 创建新作品
      const { code, screenshot, title, author } = req.body;
      try {
        // 数据验证 (根据需要添加更多验证规则)
        if (!code || !screenshot || !title || !author) {
          return res.status(400).json({ message: '缺少必要参数' });
        }

        const newWork = {
          code,
          screenshot,
          title,
          author,
          createdAt: new Date(),
        };

        const result = await collection.insertOne(newWork); // 插入新作品
        res.status(201).json({ message: '作品创建成功', workId: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: '作品创建失败' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
