const https = require('https');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Client {
  constructor(cookie) {
    this.cookie = cookie;
    this.organizationId = this.getOrganizationId();
  }

  getHeaders() {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://claude.ai/chats',  
      'Content-Type': 'application/json',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Connection': 'keep-alive',
      'Cookie': `${this.cookie}`
    };
  }

  getOrganizationId() {
    const url = 'https://claude.ai/api/organizations';
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://claude.ai/chats',  
      'Content-Type': 'application/json',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Connection': 'keep-alive',
      'Cookie': `${this.cookie}`
    };

  return new Promise((resolve, reject) => {
    const req = https.request(url, { headers }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const res = JSON.parse(data);
          if (res[0] && res[0].uuid) {
            const uuid = res[0].uuid;
            resolve(uuid);
          } else {
            reject(new Error('Invalid UUID'));
          }
        } catch (error) {
          reject(new Error('Error parsing response data'));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });

    req.end();
  });
  }

  getContentType(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.csv': 'text/csv'
    };

    return contentTypes[extension] || 'application/octet-stream';
  }

  listAllConversations() {
    const url = `https://claude.ai/api/organizations/${this.organizationId}/chat_conversations`;
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://claude.ai/chats',
      'Content-Type': 'application/json',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Connection': 'keep-alive',
      'Cookie': `${this.cookie}`  
    };

    return new Promise((resolve, reject) => {
      const req = https.get(url, { headers }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      req.on('error', (error) => {
        reject(error);
      });
    });
  }

  sendMessage(prompt, conversationId, attachment) {
    const url = 'https://claude.ai/api/append_message';

    let attachments = [];

    if (attachment) {
      const attachmentResponse = this.uploadAttachment(attachment);

      if (attachmentResponse) {
        attachments = [attachmentResponse];
      } else {
        return Promise.reject('Error: Invalid file format. Please try again.');
      }
    }

    if (!attachment) {
      attachments = []; 
    }

    const payload = JSON.stringify({
      completion: {
        prompt,
        timezone: 'Asia/Kolkata',
        model: 'claude-2'
      },
      organization_uuid: this.organizationId,
      conversation_uuid: conversationId,
      text: prompt,
      attachments
    });

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept': 'text/event-stream, text/event-stream',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://claude.ai/chats',
      'Content-Type': 'application/json',  
      'Origin': 'https://claude.ai',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Cookie': `${this.cookie}`,
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'TE': 'trailers'
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, { 
        method: 'POST',
        headers,
        data: payload
      }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const lines = data.split('\n');
          const lastLine = lines[lines.length - 1];
          const json = JSON.parse(lastLine.substring(6));
          
          resolve(json.completion);
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  deleteConversation(conversationId) {
    const url = `https://claude.ai/api/organizations/${this.organizationId}/chat_conversations/${conversationId}`;

    const payload = JSON.stringify(conversationId);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/json',
      'Content-Length': '38',
      'Referer': 'https://claude.ai/chats',
      'Origin': 'https://claude.ai',  
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Connection': 'keep-alive',
      'Cookie': `${this.cookie}`,
      'TE': 'trailers'    
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'DELETE',
        headers,
        data: payload  
      }, (res) => {
        if (res.statusCode === 204) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  chatConversationHistory(conversationId) {
    const url = `https://claude.ai/api/organizations/${this.organizationId}/chat_conversations/${conversationId}`;

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://claude.ai/chats',
      'Content-Type': 'application/json',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Connection': 'keep-alive',
      'Cookie': `${this.cookie}`
    };

    return new Promise((resolve, reject) => {
      const req = https.get(url, { headers }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      req.on('error', (error) => {
        reject(error);
      });
    });
  }

  generateUuid() {
    const id = uuidv4();
    return `${id.slice(0,8)}-${id.slice(9,13)}-${id.slice(14,18)}-${id.slice(19,23)}-${id.slice(24)}`; 
  }

  createNewChat() {
    const url = `https://claude.ai/api/organizations/${this.organizationId}/chat_conversations`;
    const uuid = this.generateUuid();

    const payload = JSON.stringify({ uuid, name: '' });

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://claude.ai/chats',
      'Content-Type': 'application/json',
      'Origin': 'https://claude.ai',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Cookie': this.cookie,
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'TE': 'trailers'  
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST',
        headers,
        data: payload
      }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      req.on('error', (error) => {
        reject(error);
      });
      
      req.end();
    });
  }

  async resetAll() {
    const conversations = await this.listAllConversations();
    
    for (let conversation of conversations) {
      const conversationId = conversation.uuid;
      await this.deleteConversation(conversationId);
    }

    return true;
  }

  uploadAttachment(filePath) {
    if (filePath.endsWith('.txt')) {
      const fileName = path.basename(filePath);
      const fileSize = fs.statSync(filePath).size;
      const fileType = 'text/plain';

      const fileContent = fs.readFileSync(filePath, 'utf8');

      return {
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        extracted_content: fileContent  
      };
    }

    const url = 'https://claude.ai/api/convert_document';

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://claude.ai/chats',
      'Origin': 'https://claude.ai',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Connection': 'keep-alive',
      'Cookie': `${this.cookie}`,
      'TE': 'trailers'
    };

    const fileName = path.basename(filePath);
    const contentType = this.getContentType(filePath);

    const formData = {
      file: fs.createReadStream(filePath),
      if (this.organizationId) {
        orgUuid: this.organizationId  
      } else {
        reject(new Error('Invalid UUID'));
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST',
        headers,
        data: formData
      }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));  
          } else {
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  renameChat(title, conversationId) {
    const url = 'https://claude.ai/api/rename_chat';

    const payload = JSON.stringify({
      organization_uuid: this.organizationId,
      conversation_uuid: conversationId,
      title
    });

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/json',
      'Referer': 'https://claude.ai/chats',
      'Origin': 'https://claude.ai',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Connection': 'keep-alive',
      'Cookie': `${this.cookie}`,
      'TE': 'trailers'    
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST', 
        headers,
        data: payload
      }, (res) => {
        if (res.statusCode === 200) {
          resolve(true);  
        } else {
          resolve(false);
        }
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }
}

module.exports = Client;
