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