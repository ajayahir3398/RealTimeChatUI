import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://chat-app-api-111k.onrender.com', {
        transports: ['websocket', 'polling'],
        autoConnect: true
      });
  }

  joinRoom(roomId: string) {
    this.socket.emit('joinRoom', roomId);
  }

  sendMessage(chatId: string, message: any) {
    this.socket.emit('sendMessage', { chatId, message });
  }

  onMessage(callback: (message: any) => void) {
    this.socket.on('receiveMessage', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
} 