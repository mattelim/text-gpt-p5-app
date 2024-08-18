/** @type {import('next').NextConfig} */
module.exports = {
    output: 'standalone',
    env: {
      // 你的环境变量
      WHITELISTED_DOMAINS: '',
      MODEL: "gemini-1.5-pro",
      OPENAI_API_KEY: 'sk-GghRJxAQJWqVNQSu41009f5c21B44a33B99c88BaE33d8a4e',
      API_URL: 'https://openai.snakecoding.club/v1/chat/completions',
      TEMPERATURE:0.5,
      MAX_TOKENS:4096
    },
  };