const Client = require('../main.js');

describe('Client', () => {
  test('constructor', () => {
    const client = new Client('cookie');
    expect(client.cookie).toBe('cookie');
  });

  test('getHeaders', () => {
    const client = new Client('cookie');
    const headers = client.getHeaders();
    expect(headers).toEqual({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://claude.ai/chats',  
      'Content-Type': 'application/json',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Connection': 'keep-alive',
      'Cookie': 'cookie'
    });
  });

  // Add more tests for the other methods in the Client class
});