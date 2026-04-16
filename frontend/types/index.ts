export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

export type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  createdAt?: string;
  image?: {          // ✅ ADICIONADO
    data?: unknown;
    contentType?: string;
  };
};

export type DashboardData = {
  message: string;
  totalUsers: number;
  totalProducts: number;
  loggedUser: {
    id: string;
    email: string;
    role: string;
  };
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
};