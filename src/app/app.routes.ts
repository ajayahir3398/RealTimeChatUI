import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { AddChatComponent } from './components/add-chat/add-chat.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'chats', 
    component: ChatListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'add-chat', 
    component: AddChatComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'chat/:id', 
    component: ChatComponent,
    canActivate: [AuthGuard]
  }
];
