export interface ContactUser {
  _id: string;
  name: string;
  mobile: string;
  profilePic?: string;
  status?: string;
}

export interface Contact {
  _id: string;
  name: string;
  mobile: string;
  profilePic?: string;
  status?: string;
  addedAt: string;
}

export interface CreateContactRequest {
  mobile: string;
  name: string;
}

export interface ContactsResponse {
  status: string;
  data: {
    contacts: Contact[];
    totalContacts: number;
  };
} 