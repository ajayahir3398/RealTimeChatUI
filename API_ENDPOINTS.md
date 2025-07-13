# API Endpoints for Node.js Backend

This document lists the API endpoints that need to be implemented in your Node.js backend to work with the Angular chat application.

## Authentication

All API requests (except login and register) require a JWT token in the Access token header:
```
Access token: <token>
```

The Angular app automatically includes this token in all HTTP requests via the AuthInterceptor.

## Authentication Endpoints (Already Implemented)

- `POST /api/auth/register` - User registration
  - Parameters: `name`, `mobile`, `password`
  - Response: `{ status: "success", message: "Registration successful", data: { user: User, token: string } }`

- `POST /api/auth/login` - User login
  - Parameters: `mobile`, `password`
  - Response: `{ status: "success", message: "Login successful", data: { user: User, token: string } }`

## Contact Endpoints (Already Implemented)

- `GET /api/contacts` - Get all contacts
  - **Auth Required**: Yes
  - Response: 
    ```json
    {
      "status": "success",
      "data": {
        "contacts": [
          {
            "_id": "contact_id",
            "contactId": {
              "_id": "user_id",
              "name": "User Name",
              "mobile": "1234567890",
              "profilePic": "https://via.placeholder.com/150x150?text=User",
              "status": "offline"
            },
            "name": "Contact Name",
            "addedAt": "2025-07-12T22:32:06.871Z"
          }
        ],
        "totalContacts": 1
      }
    }
    ```

- `POST /api/contacts` - Add a new contact
  - **Auth Required**: Yes
  - Body: `{ mobile: string, name: string }`
  - Response: `Contact`

## Chat Endpoints (Implemented)

- `GET /api/chats` - Get all chats for the current user
  - **Auth Required**: Yes
  - Response:
    ```json
    {
      "status": "success",
      "data": {
        "chats": [
          {
            "_id": "6872f367fdcee23bb92cc6d5",
            "isGroup": false,
            "members": [
              {
                "_id": "68726ce2f4bfaa4d47e9a9a5",
                "name": "Ajay Bandhiya",
                "mobile": "9876543210",
                "profilePic": "https://via.placeholder.com/150x150?text=User",
                "status": "online"
              },
              {
                "_id": "6872e2262c9eb3cdd635db11",
                "name": "Ajuu",
                "mobile": "9925129541",
                "profilePic": "https://via.placeholder.com/150x150?text=User",
                "status": "online"
              }
            ],
            "groupName": null,
            "groupAdmin": null,
            "profilePic": null,
            "lastMessage": {
              "_id": "68734d01688c098c0fac867a",
              "createdAt": "2025-07-13T06:06:58.264Z"
            },
            "createdAt": "2025-07-12T23:44:40.017Z",
            "updatedAt": "2025-07-13T06:06:58.380Z",
            "__v": 0
          }
        ],
        "totalChats": 1
      }
    }
    ```
- `GET /api/chats/{chatId}` - Get a specific chat with participants
  - **Auth Required**: Yes
- `POST /api/chats` - Create a new chat
  - **Auth Required**: Yes
  - Body: `{ participants: string[], createdAt: string, updatedAt: string }`
- `POST /api/chats/individual` - Create an individual chat with a contact
  - **Auth Required**: Yes
  - Body: `{ mobile: string }`
  - Response: 
    ```json
    {
      "status": "success",
      "message": "Individual chat created successfully",
      "data": {
        "chat": {
          "_id": "string",
          "isGroup": false,
          "members": [
            {
              "_id": "string",
              "name": "string",
              "mobile": "5757215646",
              "profilePic": "https://via.placeholder.com/150x150?text=User",
              "status": "offline",
              "socketId": "string",
              "createdAt": "2025-07-12T23:38:08.105Z",
              "updatedAt": "2025-07-12T23:38:08.105Z"
            }
          ],
          "groupName": "Work Team",
          "groupAdmin": {
            "_id": "string",
            "name": "string",
            "mobile": "1554606912",
            "profilePic": "https://via.placeholder.com/150x150?text=User",
            "status": "offline",
            "socketId": "string",
            "createdAt": "2025-07-12T23:38:08.105Z",
            "updatedAt": "2025-07-12T23:38:08.105Z"
          },
          "profilePic": "https://example.com/group-pic.jpg",
          "lastMessage": {},
          "createdAt": "2025-07-12T23:38:08.105Z",
          "updatedAt": "2025-07-12T23:38:08.105Z"
        }
      }
    }
    ```

## Message Endpoints (Implemented)

- `GET /api/messages/chat/{chatId}?limit={limit}&skip={skip}` - Get messages for a chat
  - **Auth Required**: Yes
  - Parameters:
    - `chatId` (path): Chat ID
    - `limit` (query): Number of messages to return (default: 50)
    - `skip` (query): Number of messages to skip (default: 0)
  - Response:
    ```json
    {
      "status": "success",
      "data": {
        "messages": [
          {
            "_id": "string",
            "chatId": "string",
            "senderId": {
              "_id": "string",
              "name": "string",
              "mobile": "2628241347",
              "profilePic": "https://via.placeholder.com/150x150?text=User",
              "status": "offline",
              "socketId": "string",
              "createdAt": "2025-07-13T00:21:14.010Z",
              "updatedAt": "2025-07-13T00:21:14.010Z"
            },
            "receiverId": {
              "_id": "string",
              "name": "string",
              "mobile": "4367564183",
              "profilePic": "https://via.placeholder.com/150x150?text=User",
              "status": "offline",
              "socketId": "string",
              "createdAt": "2025-07-13T00:21:14.011Z",
              "updatedAt": "2025-07-13T00:21:14.011Z"
            },
            "message": "Hello! How are you?",
            "type": "text",
            "fileUrl": "https://example.com/file.jpg",
            "replyTo": "string",
            "seenBy": [
              {
                "_id": "string",
                "name": "string",
                "mobile": "8038328348",
                "profilePic": "https://via.placeholder.com/150x150?text=User",
                "status": "offline",
                "socketId": "string",
                "createdAt": "2025-07-13T00:21:14.011Z",
                "updatedAt": "2025-07-13T00:21:14.011Z"
              }
            ],
            "editedAt": "2025-07-13T00:21:14.011Z",
            "deleted": false,
            "deletedAt": "2025-07-13T00:21:14.011Z",
            "deletedBy": {
              "_id": "string",
              "name": "string",
              "mobile": "7157088859",
              "profilePic": "https://via.placeholder.com/150x150?text=User",
              "status": "offline",
              "socketId": "string",
              "createdAt": "2025-07-13T00:21:14.011Z",
              "updatedAt": "2025-07-13T00:21:14.011Z"
            },
            "createdAt": "2025-07-13T00:21:14.011Z",
            "updatedAt": "2025-07-13T00:21:14.011Z"
          }
        ],
        "totalMessages": 0,
        "hasMore": true
      }
    }
    ```
- `POST /api/messages` - Send a new message
  - **Auth Required**: Yes
  - Body: 
    ```json
    {
      "chatId": "64f8a1b2c3d4e5f6a7b8c9d2",
      "message": "Hello! How are you?",
      "type": "text",
      "fileUrl": "https://example.com/file.jpg",
      "replyTo": "64f8a1b2c3d4e5f6a7b8c9d3"
    }
    ```
  - Response:
    ```json
    {
      "status": "success",
      "message": "Message sent successfully",
      "data": {
        "message": {
          "chatId": "6872f367fdcee23bb92cc6d5",
          "senderId": {
            "_id": "68726ce2f4bfaa4d47e9a9a5",
            "name": "Ajay Bandhiya",
            "mobile": "9876543210",
            "profilePic": "https://via.placeholder.com/150x150?text=User",
            "status": "online"
          },
          "receiverId": {
            "_id": "6872e2262c9eb3cdd635db11",
            "name": "Ajuu",
            "mobile": "9925129541",
            "profilePic": "https://via.placeholder.com/150x150?text=User",
            "status": "online"
          },
          "message": "How are u?",
          "type": "text",
          "fileUrl": null,
          "replyTo": null,
          "seenBy": [],
          "editedAt": null,
          "deleted": false,
          "deletedAt": null,
          "deletedBy": null,
          "_id": "68734b29688c098c0fac8640",
          "createdAt": "2025-07-13T05:59:05.615Z",
          "updatedAt": "2025-07-13T05:59:05.615Z",
          "__v": 0
        }
      }
    }
    ```
- `PATCH /api/messages/{messageId}` - Mark message as read
  - **Auth Required**: Yes
  - Body: `{ isRead: true }`

## User Endpoints (To Be Implemented)

- `GET /api/users` - Get all users
  - **Auth Required**: Yes
- `GET /api/users/{userId}` - Get a specific user
  - **Auth Required**: Yes

## Data Models

### User (MongoDB Structure)
```typescript
{
  _id: string;
  name: string;
  mobile: string;
  profilePic?: string;
  status?: string;
  socketId?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Contact (MongoDB Structure)
```typescript
{
  _id: string;
  contactId: {
    _id: string;
    name: string;
    mobile: string;
    profilePic?: string;
    status?: string;
  };
  name: string;
  addedAt: string;
}
```

### Chat
```typescript
{
  _id: string;
  isGroup: boolean;
  members: User[]; // Array of user objects
  groupName?: string;
  groupAdmin?: User;
  profilePic?: string;
  lastMessage?: {
    text: string;
    sender: string; // user _id
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Message
```typescript
{
  _id: string;
  chatId: string;
  senderId: User; // User object
  receiverId: User; // User object
  message: string;
  type: string;
  fileUrl?: string;
  replyTo?: string;
  seenBy: User[];
  editedAt?: string;
  deleted: boolean;
  deletedAt?: string;
  deletedBy?: User;
  createdAt: string;
  updatedAt: string;
}
```

## Error Handling

The Angular app includes error interceptors that handle:

- **401 Unauthorized**: Automatically logs out user and redirects to login
- **403 Forbidden**: Logs access denied message
- **500+ Server Errors**: Logs server errors for debugging

## Token Management

- JWT tokens are automatically stored in localStorage after login/register
- Token expiration is checked on app startup and before API calls
- Expired tokens automatically log out the user
- All HTTP requests automatically include the Access token header

## Route Protection

Protected routes in the Angular app:
- `/chats` - Chat list (requires authentication)
- `/add-chat` - Add new chat (requires authentication)
- `/chat/:id` - Individual chat (requires authentication)

Public routes:
- `/login` - Login page
- `/register` - Registration page

## Notes

- All user IDs are now MongoDB ObjectId strings (`_id`)
- Chat participants and message sender/receiver IDs are string references to user `_id`
- The Angular app is configured to work with this structure
- Contact management is now separate from user management
- Authentication is handled automatically via interceptors
- Once you implement the remaining endpoints, uncomment the corresponding lines in `src/app/services/chat.service.ts` 