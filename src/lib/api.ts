const API_URL = 'http://localhost:3000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  fullName: string;
}

export interface MissingPersonData {
  name: string;
  age: number;
  lastSeen: string;
  location: string;
  description: string;
  photoUrl: string;
  contactInfo: string;
}

class Api {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async login(credentials: LoginCredentials) {
    const data = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData: RegisterData) {
    const data = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.token);
    return data;
  }

  async reportMissingPerson(personData: MissingPersonData) {
    return this.request('/missing-persons', {
      method: 'POST',
      body: JSON.stringify(personData),
    });
  }

  async getMissingPersons() {
    return this.request('/missing-persons');
  }

  async updatePersonStatus(id: number, status: 'missing' | 'found') {
    return this.request(`/missing-persons/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

export const api = new Api();