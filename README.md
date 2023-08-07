# ClaudeAI-API ( Unofficial )

A Node.js unofficial library for interacting with the Claude.ai API.

## Installation

```bash
npm install claude-no-api
```
## Cookie
* You can get cookie from the browser's developer tools network tab ( see for any claude.ai requests check out cookie ,copy whole value ) or storage tab ( You can find cookie of claude.ai ,there will be four values )

* (Checkout below image for the format of cookie ,It is Better to Use from network tab to grab cookie easily )

   ![Screenshot (8)](https://github.com/KoushikNavuluri/Claude-API/assets/103725723/355971e3-f46c-47fc-a3cf-008bb55bb4c6)

## Usage

```js
const Claude = require('claude-no-api');

const client = new Claude('session_cookie');

client.listAllConversations()
  .then(conversations => {
    // use conversations
  })
  .catch(err => {
    console.error(err);
  });

client.sendMessage('Hello', 'conversation_id')
  .then(response => {
    console.log(response); 
  })
  .catch(err => {
    console.error(err);
  });  
```

## API

The Claude class provides the following methods:

- `getOrganizationId()` - Returns the organization UUID for the given cookie
- `getContentType()` - Get content type for a file based on extension
- `listAllConversations()` - Get all conversations for the organization
- `sendMessage(prompt, conversationId, attachment)` - Send a message to a conversation
- `deleteConversation(conversationId)` - Delete a conversation
- `chatConversationHistory(conversationId)` - Get message history for a conversation 
- `generateUuid()` - Generate a random UUID
- `createNewChat()` - Create a new conversation
- `resetAll()` - Delete all conversations 
- `uploadAttachment(filePath)` - Upload an attachment
- `renameChat(title, conversationId)` - Rename a conversation

All methods return promises.

## Contributing

Pull requests are welcome! Feel free to open issues for any bugs or desired features.

## License

MIT
