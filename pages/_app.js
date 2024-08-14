import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import './styles/App.css'; // 引入 CSS 文件

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}