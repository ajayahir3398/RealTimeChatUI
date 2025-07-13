import { Component, OnInit, OnDestroy, signal, computed, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { Chat, Message } from '../../models/chat.model';
import { User } from '../../models/user.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private socketService = inject(SocketService);

  // Signals for reactive state
  chatId = signal<string>('');
  chat = signal<Chat | null>(null);
  messages = signal<Message[]>([]);
  currentUser = signal<User | null>(null);
  newMessage = signal('');
  isLoading = signal(false);
  isSending = signal(false);
  otherMember = signal<User | null>(null);
  private destroy$ = new Subject<void>();

  // Computed signals
  hasMessages = computed(() => this.messages().length > 0);
  showLoading = computed(() => this.isLoading());
  canSendMessage = computed(() => {
    const message = this.newMessage();
    return message.trim() !== '' && !this.isSending();
  });

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser.set(user);

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.subscribe(params => {
      const id = params['id'];
      this.chatId.set(id);
      if (id) {
        this.loadChat();
        this.chatService.loadUsers();
        this.socketService.joinRoom(id);
        this.socketService.onMessage((data) => {
          console.log('message', data);
          this.messages.update(msgs => [...msgs, data.message]);
          this.scrollToBottom();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socketService.disconnect();
  }

  loadChat(): void {
    const chatId = this.chatId();
    this.chatService.getChatWithParticipants(chatId).subscribe({
      next: (chat:any) => {
        this.chat.set(chat);
        // Set otherMember for individual chat
        const currentUser = this.currentUser();
        if (chat && !chat.isGroup && currentUser) {
          const other = chat.data.chat.members.find((member: User) => member._id !== currentUser._id) || null;
          this.otherMember.set(other);
        } else {
          this.otherMember.set(null);
        }
        this.loadMessages();
      },
      error: (error) => {
        console.error('Error loading chat:', error);
      }
    });
  }

  loadMessages(): void {
    this.isLoading.set(true);
    this.chatService.getMessages(this.chatId()).subscribe({
      next: (response) => {
        this.messages.set(response.data.messages.reverse());
        this.isLoading.set(false);
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.isLoading.set(false);
      }
    });
  }

  updateNewMessage(message: string): void {
    this.newMessage.set(message);
  }

  sendMessage(): void {
    if (!this.canSendMessage()) return;

    const currentUser = this.currentUser();
    const chat = this.chat();
    if (!currentUser || !chat) return;

    this.isSending.set(true);
    const messageData = {
      chatId: this.chatId(),
      message: this.newMessage().trim(),
      type: 'text'
    };

    // Send via REST for persistence
    this.chatService.sendMessage(messageData).subscribe({
      next: (message) => {
        // this.messages.update(messages => [...messages, message]);
        this.newMessage.set('');
        this.isSending.set(false);
        this.scrollToBottom();
        // Send via socket for real-time update
        this.socketService.sendMessage(this.chatId(), message);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.isSending.set(false);
      }
    });
  }

  getChatTitle(): string {
    const chat = this.chat();
    const currentUser = this.currentUser();
    const users = this.chatService.users();

    if (!chat || !currentUser || !users.length) return 'Chat';

    const otherMembers = chat.members.filter(member => member._id !== currentUser._id);
    if (otherMembers.length === 0) return 'You';

    const otherUser = users.find(user => user._id === otherMembers[0]._id);
    return otherUser ? otherUser.name : 'Unknown';
  }

  getChatStatus(): string {
    const chat = this.chat();
    if (!chat) return '';

    const lastMessage = chat.lastMessage;
    if (!lastMessage) return 'No messages yet';

    const date = new Date(lastMessage.createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Active now';
    } else if (diffInHours < 24) {
      return `Last active ${Math.floor(diffInHours)} hours ago`;
    } else {
      return `Last active ${Math.floor(diffInHours / 24)} days ago`;
    }
  }

  getFormattedTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  goBack(): void {
    this.router.navigate(['/chats']);
  }
} 