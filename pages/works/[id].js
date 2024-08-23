// pages/work/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import RunContainer from "../components/RunContainer";
import Link from 'next/link'; // 引入 Link 组件
 
export default function WorkDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [work, setWork] = useState(null);
    const [sandboxRunning, setSandboxRunning] = useState(false); // 提升状态
    const [logMsg, setLogMsg] = useState(''); // 提升状态
    const [waiting, setWaiting] = useState(false); // 提升状态
    function runClickPlay(event) {
        event.preventDefault();
        setSandboxRunning(true);
    }

    function runClickStop(event) {
        event.preventDefault();
        setSandboxRunning(false);
        setLogMsg("");
    }

    useEffect(() => {
        const fetchWork = async () => {
            try {
                const response = await fetch(`/api/works/?id=${id}`); // 替换为你的 API 路径
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setWork(data);
            } catch (error) {
                console.error("获取作品详情失败:", error);
                // 可以在这里处理错误，例如显示错误信息给用户
            }
        };

        if (id) {
            fetchWork();
        }
    }, [id]);

    if (!work) {
        return <div>加载中...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div>
        <Link href="/share" className="text-blue-500 hover:underline">
          返回作品列表
        </Link>
        {' '} | {' '}
        <Link href="/" className="text-blue-500 hover:underline">
          主页
        </Link>
      </div>
          {/* ... 作品标题和截图 ... */}
    
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="md:w-1/2">
              <h2 className="text-xl font-bold mb-2">代码：</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {work.code}
              </pre>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-xl font-bold mb-2">运行结果：</h2>
              <RunContainer
                key="runcont-01"
                sandboxRunning={sandboxRunning}
                clickPlay={runClickPlay}
                clickStop={runClickStop}
                result={work.code}
                logMsg={logMsg}
                waiting={waiting}
              />
            </div>
          </div>
    
          <button 
            onClick={runClickPlay}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            播放作品
          </button>
        </div>
      );
}
