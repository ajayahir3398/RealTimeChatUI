export interface User {
  _id: string;
  name: string;
  mobile: string;
  profilePic?: string;
  status?: string;
  socketId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  mobile: string;
  password: string;
} 