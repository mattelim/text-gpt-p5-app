// aiModelService.test.js
import {requestAIModel } from './api/gpt_request';

describe('requestAIModel', () => {
  it('should return a response from the AI model', async () => {
    // Mock fetch to simulate API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Test response' } }]
        })
      })
    );

    const input = 'Hello, AI!';
    const model = 'MODEL1';
    const apiKey = 'test-api-key';
    const selectedOption = 'script';
    const currentConversation = [];

    const response = await requestAIModel(input, model, apiKey, selectedOption, currentConversation);
    
    expect(response).toBe('Test response');
    expect(global.fetch).toHaveBeenCalledTimes(1); // 确保 fetch 被调用了一次
  });

  it('should throw an error when the API response is not ok', async () => {
    // Mock fetch to simulate an error response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    const input = 'Hello, AI!';
    const model = 'MODEL1';
    const apiKey = 'test-api-key';
    const selectedOption = 'script';
    const currentConversation = [];

    await expect(requestAIModel(input, model, apiKey, selectedOption, currentConversation)).rejects.toThrow('HTTP error! status: 500');
  });
});
