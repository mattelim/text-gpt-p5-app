/** @type {import('next').NextConfig} */
module.exports = {
    output: 'standalone',
    env: {
      // 你的环境变量
      WHITELISTED_DOMAINS: '',
      MODEL: 'gpt-4o-mini',
      OPENAI_API_KEY: 'sk-GghRJxAQJWqVNQSu41009f5c21B44a33B99c88BaE33d8a4e',
      API_URL: 'https://openai.snakecoding.club/v1/chat/completions',
    },
  };