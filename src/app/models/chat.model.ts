import { User } from './user.model';

export interface Message {
  _id: string;
  chatId: string;
  senderId: User;
  receiverId: User;
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

export interface MessagesResponse {
  status: string;
  data: {
    messages: Message[];
    totalMessages: number;
    hasMore: boolean;
  };
}

export interface LastMessage {
  _id: string;
  message: string;
  createdAt: string;
}

export interface Chat {
  _id: string;
  isGroup: boolean;
  members: User[];
  groupName?: string;
  groupAdmin?: User;
  profilePic?: string;
  lastMessage?: LastMessage;
  createdAt: string;
  updatedAt: string;
} 