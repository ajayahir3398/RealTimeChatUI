# Chat Application

A modern chat application built with Angular 20 and JSON Server for the backend simulation.

## Features

- **User Authentication**: Register and login with mobile number and password
- **Chat Management**: View recent chats and start new conversations
- **Contact Management**: Add and manage contacts
- **Real-time Messaging**: Send and receive messages in real-time
- **Modern UI**: Beautiful and responsive design

## Application Flow

1. **User Registration & Login**
   - Users can register using name, mobile number, and password
   - Login with mobile number and password
   - Automatic redirection to chat list after successful login

2. **Chat List Page**
   - Displays recent chats with last message and timestamp
   - "Add New Chat" button to start new conversations
   - User can logout from this page

3. **Add New Chat Page**
   - Shows user's contact list
   - Search functionality to find contacts
   - "Add Contact" button to add new contacts
   - Click on any contact to start a chat

4. **Chat Page**
   - Full conversation view with message history
   - Send new messages
   - Real-time message display
   - Back navigation to chat list

## Tech Stack

- **Frontend**: Angular 20 with standalone components
- **Backend**: JSON Server (simulation)
- **Styling**: CSS with modern design
- **State Management**: RxJS Observables
- **Routing**: Angular Router

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chatApp
```

2. Install dependencies:
```bash
npm install
```

3. Start JSON Server (backend simulation):
```bash
npm run json-server
```

4. In a new terminal, start the Angular development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:4200`

## Usage

### Default Users

The application comes with pre-configured users for testing:

1. **John Doe**
   - Mobile: 1234567890
   - Password: password123

2. **Jane Smith**
   - Mobile: 9876543210
   - Password: password123

3. **Mike Johnson**
   - Mobile: 5555555555
   - Password: password123

### Getting Started

1. **Register/Login**: Use the login page to sign in with existing credentials or register a new account
2. **View Chats**: After login, you'll see the chat list with existing conversations
3. **Start New Chat**: Click "Add New Chat" to see your contacts and start new conversations
4. **Add Contacts**: Use the "Add Contact" button to add new contacts to your list
5. **Send Messages**: Click on any chat to open the conversation and send messages

## API Endpoints

The application uses JSON Server with the following endpoints:

- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /users?mobile=xxx&password=xxx` - Login user
- `GET /chats?participants_like=xxx` - Get user's chats
- `POST /chats` - Create new chat
- `GET /messages?chatId=xxx` - Get chat messages
- `POST /messages` - Send new message
- `GET /contacts?userId=xxx` - Get user's contacts
- `POST /contacts` - Add new contact

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   ├── register/
│   │   ├── chat-list/
│   │   ├── add-chat/
│   │   └── chat/
│   ├── models/
│   │   ├── user.model.ts
│   │   └── chat.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── chat.service.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.ts
├── styles.scss
└── main.ts
```

## Future Enhancements

- **Real-time Communication**: Implement WebSocket connections using Socket.IO
- **Message Status**: Read receipts and typing indicators
- **File Sharing**: Support for images, documents, and media files
- **Group Chats**: Multi-participant conversations
- **Push Notifications**: Browser notifications for new messages
- **Message Encryption**: End-to-end encryption for privacy
- **User Profiles**: Profile pictures and status updates

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Code Formatting
The project uses Prettier for code formatting. Configure your editor to format on save.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
