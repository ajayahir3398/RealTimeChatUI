import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Contact } from '../../models/contact.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-add-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-chat.component.html',
  styleUrl: './add-chat.component.scss'
})
export class AddChatComponent implements OnInit {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals for reactive state
  contacts = signal<Contact[]>([]);
  searchTerm = signal('');
  currentUser = signal<User | null>(null);
  isLoading = signal(false);
  showModal = signal(false);
  isAddingContact = signal(false);
  newContact = signal({
    name: '',
    mobile: ''
  });

  // Computed signals
  filteredContacts = computed(() => {
    const contacts = this.contacts();
    const search = this.searchTerm();
    
    if (!search.trim()) {
      return contacts;
    } else {
      return contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.mobile.includes(search)
      );
    }
  });

  hasContacts = computed(() => this.filteredContacts().length > 0);
  showLoading = computed(() => this.isLoading());
  showNoContacts = computed(() => !this.isLoading() && this.filteredContacts().length === 0);

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser.set(user);
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading.set(true);
    this.chatService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        this.isLoading.set(false);
      }
    });
  }

  updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  startChat(contact: Contact): void {
    const currentUser = this.currentUser();
    if (!currentUser) return;

    this.chatService.createIndividualChat(contact.mobile).subscribe({
      next: (chat) => {
        this.router.navigate(['/chat', chat._id]);
      },
      error: (error) => {
        console.error('Error creating individual chat:', error);
        alert('Failed to create chat. Please try again.');
      }
    });
  }

  showAddContactModal(): void {
    this.showModal.set(true);
    this.newContact.set({ name: '', mobile: '' });
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  updateNewContactName(name: string): void {
    this.newContact.update(contact => ({ ...contact, name }));
  }

  updateNewContactMobile(mobile: string): void {
    this.newContact.update(contact => ({ ...contact, mobile }));
  }

  addContact(): void {
    this.isAddingContact.set(true);
    const contactData = this.newContact();

    this.chatService.addContact(contactData).subscribe({
      next: (contact) => {
        this.closeModal();
        this.loadContacts();
        this.isAddingContact.set(false);
      },
      error: (error) => {
        console.error('Error adding contact:', error);
        this.isAddingContact.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/chats']);
  }
} 