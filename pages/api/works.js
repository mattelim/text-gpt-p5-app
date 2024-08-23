// pages/api/works.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// 打开数据库连接 (异步)
const connectToDatabase = async () => {
  const db = await open({
    filename: './database.sqlite', // 数据库文件路径
    driver: sqlite3.Database,
  });
  return db;
};

export default async function handler(req, res) {
  const { method } = req;
  const db = await connectToDatabase(); // 连接到数据库
  switch (method) {
    case 'GET':
      // 获取作品列表或单个作品
      try {
        if (req.query.id) {
          // 根据 ID 获取单个作品
          const id = req.query.id;
          const work = await db.get('SELECT * FROM works WHERE id = ?', [id]);
          if (!work) {
            return res.status(404).json({ message: '未找到该作品' });
          }
          res.status(200).json(work);
        } else {
          // 获取所有作品
          const works = await db.all('SELECT * FROM works');
          res.status(200).json(works);
        }
      } catch (error) {
        console.error('获取作品失败:', error);
        res.status(500).json({ message: '获取作品失败', error: error.message });
      }
      break;
    case 'POST':
      // 创建新作品
      const { code, screenshot, title, author } = req.body;
      try {
       // console.log("创建新作品## ", req.body);
        // 数据验证 (根据需要添加更多验证规则)
        if (!code || !screenshot || !title || !author) {
          return res.status(400).json({ message: '缺少必要参数' });
        }

        const insertResult = await db.run(
          'INSERT INTO works (code, screenshot, title, author) VALUES (?, ?, ?, ?)',
          [code, screenshot, title, author]
        );
        console.log('insertResult:',insertResult);
        // 检查是否成功插入数据
        if (insertResult.changes === 1) {
          console.log('作品创建成功');
          res.status(201).json({
            message: '作品创建成功',
            workId: insertResult.lastID,
          });
        } else {
          console.error('作品创建失败: 未成功插入数据');
          res.status(500).json({
            message: '作品创建失败',
            error: '无法插入数据到数据库',
          });
        }
      } catch (error) {
        console.error('作品创建失败:', error.message, error.stack); // 打印详细的错误信息
        res.status(500).json({
          message: '作品创建失败',
          error: error.message,
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
