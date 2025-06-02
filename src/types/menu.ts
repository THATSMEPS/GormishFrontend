export interface Addon {
  name: string;
  extraPrice: number;
  available: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  image?: string;
  addons: Addon[];
  gstCategory: string;
}

export interface FormData {
  name: string;
  description: string;
  price: number;
  gstCategory: string;
  isAvailable: boolean;
  addons: Addon[];
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  detail?: string;
}

export interface GstCategory {
  value: string;
  label: string;
}
