Here is a README for a GitHub repo for this Node.js library:

# Claude.js

A Node.js library for interacting with the Claude.ai API.

## Installation

```bash
npm install claudejs
```

## Usage

```js
const Claude = require('claudejs');

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
