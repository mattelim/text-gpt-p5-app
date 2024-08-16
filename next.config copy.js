/** @type {import('next').NextConfig} */
module.exports = {
    output: 'standalone',
    env: {
      // 你的环境变量
      WHITELISTED_DOMAINS: process.env.WHITELISTED_DOMAINS,
      MODEL: process.env.MODEL,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      API_URL: process.env.API_URL,
    },
  };