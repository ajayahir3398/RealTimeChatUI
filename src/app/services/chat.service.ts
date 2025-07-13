import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Chat, Message, MessagesResponse } from '../models/chat.model';
import { User } from '../models/user.model';
import { Contact, CreateContactRequest, ContactsResponse } from '../models/contact.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Signal-based cache for reactive components
  users = signal<User[]>([]);
  isLoadingUsers = signal(false);

  // Chat operations
  getChats(): Observable<Chat[]> {
    return this.http.get<{ status: string, data: { chats: Chat[], totalChats: number } }>(`${apiUrl}/api/chats`).pipe(
      map(response => response.data.chats)
    );
  }

  getChatWithParticipants(chatId: string): Observable<Chat> {
    return this.http.get<Chat>(`${apiUrl}/api/chats/${chatId}`);
  }

  createChat(participants: string[]): Observable<Chat> {
    const chat: Partial<Chat> = {
      isGroup: false,
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.http.post<Chat>(`${apiUrl}/api/chats`, chat);
  }

  createIndividualChat(mobile: string): Observable<Chat> {
    const requestBody = { mobile };
    return this.http.post<{ status: string, message: string, data: { chat: Chat } }>(`${apiUrl}/api/chats/individual`, requestBody).pipe(
      map(response => response.data.chat)
    );
  }

  // Message operations
  getMessages(chatId: string, limit: number = 50, skip: number = 0): Observable<MessagesResponse> {
    return this.http.get<MessagesResponse>(`${apiUrl}/api/messages/chat/${chatId}?limit=${limit}&skip=${skip}`);
  }

  sendMessage(message: { chatId: string; message: string; type: string; fileUrl?: string; replyTo?: string }): Observable<Message> {
    const newMessage = {
      ...message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.http.post<{ status: string, message: string, data: { message: Message } }>(`${apiUrl}/api/messages`, newMessage).pipe(
      map(response => response.data.message)
    );
  }

  markMessageAsRead(messageId: string): Observable<Message> {
    return this.http.patch<Message>(`${apiUrl}/api/messages/${messageId}`, { isRead: true });
  }

  // User operations
  getUsers(): Observable<User[]> {
    return of([]);
  }

  loadUsers(): void {
    if (this.users().length > 0) {
      return;
    }

    this.isLoadingUsers.set(true);

    this.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoadingUsers.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoadingUsers.set(false);
      }
    });
  }

  getUserById(userId: string): Observable<User> {
    return of(null as any);
  }

  getUserContacts(userId: string): Observable<User[]> {
    return of([]);
  }

  // Contact operations
  getContacts(): Observable<Contact[]> {
    return this.http.get<ContactsResponse>(`${apiUrl}/api/contacts`).pipe(
      map(response => response.data.contacts)
    );
  }

  addContact(contact: CreateContactRequest): Observable<Contact> {
    return this.http.post<Contact>(`${apiUrl}/api/contacts`, contact);
  }

  clearUsersCache(): void {
    this.users.set([]);
  }
} 