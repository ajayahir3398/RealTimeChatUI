import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Chat } from '../../models/chat.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent implements OnInit {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals for reactive state
  chats = signal<Chat[]>([]);
  currentUser = signal<User | null>(null);
  isLoading = signal(false);
  dataLoaded = signal(false);

  // Computed signals
  filteredChats = computed(() => {
    const currentUser = this.currentUser();
    const allChats = this.chats();
    
    if (!currentUser) return [];
    
    return allChats.filter(chat => {
      return chat.members.some(member => member._id === currentUser._id);
    });
  });

  hasChats = computed(() => this.filteredChats().length > 0);
  showLoading = computed(() => this.isLoading());
  showNoChats = computed(() => !this.isLoading() && this.filteredChats().length === 0);

  // Computed signal for chat titles
  chatTitles = computed(() => {
    const chats = this.filteredChats();
    const currentUser = this.currentUser();
    
    const titles = new Map<string, string>();
    
    chats.forEach(chat => {
      if (!currentUser) {
        titles.set(chat._id, 'Unknown');
        return;
      }
      
      const otherMembers = chat.members.filter(member => member._id !== currentUser._id);
      if (otherMembers.length === 0) {
        titles.set(chat._id, 'You');
      } else {
        const otherMember = otherMembers[0];
        if (otherMember) {
          titles.set(chat._id, otherMember.name);
        } else {
          titles.set(chat._id, 'Unknown User');
        }
      }
    });
    
    return titles;
  });

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser.set(user);
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.dataLoaded()) {
      this.loadUsersAndChats();
      this.dataLoaded.set(true);
    }
  }

  loadUsersAndChats(): void {
    const currentUser = this.currentUser();
    if (!currentUser) return;

    this.isLoading.set(true);
    this.loadChats();
  }

  loadChats(): void {
    const currentUser = this.currentUser();
    if (!currentUser) return;

    this.chatService.getChats().subscribe({
      next: (allChats) => {
        this.chats.set(allChats);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading chats:', error);
        this.isLoading.set(false);
      }
    });
  }

  refreshData(): void {
    this.dataLoaded.set(false);
    this.loadUsersAndChats();
    this.dataLoaded.set(true);
  }

  getChatTitle(chat: Chat): string {
    const currentUser = this.currentUser();
    
    if (!currentUser) return 'Unknown';
    
    const otherMembers = chat.members.filter(member => member._id !== currentUser._id);
    if (otherMembers.length === 0) return 'You';

    const otherMember = otherMembers[0];
    return otherMember ? otherMember.name : 'Unknown User';
  }

  getFormattedTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  }

  openChat(chatId: string): void {
    this.router.navigate(['/chat', chatId]);
  }

  navigateToAddChat(): void {
    this.router.navigate(['/add-chat']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 