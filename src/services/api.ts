interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: string;
  createdAt: string;
}

const DB_KEY = 'rt_nexus_users';

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const admins: StoredUser[] = [{
        id: 'u_admin',
        fullName: 'RT Nexus Admin',
        email: 'admin@rtnexus.enterprise',
        phone: '+250788000000',
        username: 'rtnexus',
        password: '123456',
        role: 'admin',
        createdAt: new Date().toISOString(),
      }];
      saveUsers(admins);
      return admins;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

function generateId(): string {
  return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

import { Product, RttiData } from '../types';

export interface KpiMetric {
  current: number;
  previous: number;
  change: number;
}

export interface KpiOverview {
  revenue: KpiMetric & { today: number; yesterday: number };
  activeClients: KpiMetric;
  globalEngagement: KpiMetric;
  marketplace: {
    productsInStock: number;
    totalProducts: number;
    lowStock: number;
    categories: number;
    verifiedOrders: number;
    pendingOrders: number;
    totalOrders: number;
  };
  edTech: {
    totalEnrollments: number;
    totalCourses: number;
    completionRate: number;
    activeCertificates: number;
  };
  mediaAds: {
    totalViews: number;
    activeCampaigns: number;
    pendingAds: number;
    adCtr: number;
  };
}

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed`);
  return res.json();
}

async function apiPost<T>(url: string, data: any): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${url} failed`);
  return res.json();
}

async function apiPut(url: string, data: any): Promise<void> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${url} failed`);
}

async function apiDelete(url: string): Promise<void> {
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${url} failed`);
}

/* ─────── KPI ─────── */
export async function fetchKpiOverview(): Promise<KpiOverview> {
  return apiGet<KpiOverview>('/api/kpi/overview');
}

/* ─────── PRODUCTS ─────── */
export async function fetchProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/api/products');
}

export async function createProduct(data: Record<string, any>): Promise<Product> {
  return apiPost<Product>('/api/products', data);
}

export async function updateProduct(id: string, data: Record<string, any>): Promise<void> {
  return apiPut(`/api/products/${id}`, data);
}

export async function deleteProduct(id: string): Promise<void> {
  return apiDelete(`/api/products/${id}`);
}

/* ─────── CATEGORIES ─────── */
export async function fetchCategories(): Promise<any[]> {
  return apiGet<any[]>('/api/categories');
}

export async function createCategory(data: any): Promise<any> {
  return apiPost('/api/categories', data);
}

export async function updateCategory(id: string, data: any): Promise<void> {
  return apiPut(`/api/categories/${id}`, data);
}

export async function deleteCategory(id: string): Promise<void> {
  return apiDelete(`/api/categories/${id}`);
}

/* ─────── ORDERS ─────── */
export async function fetchOrders(): Promise<any[]> {
  return apiGet<any[]>('/api/orders');
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  return apiPut(`/api/orders/${id}`, { status });
}

/* ─────── CERTIFICATES ─────── */
export async function fetchCertificates(): Promise<any[]> {
  return apiGet<any[]>('/api/certificates');
}

export async function createCertificate(data: any): Promise<any> {
  return apiPost('/api/certificates', data);
}

export async function deleteCertificate(id: string): Promise<void> {
  return apiDelete(`/api/certificates/${id}`);
}

/* ─────── ADVERTISEMENTS ─────── */
export async function fetchAds(): Promise<any[]> {
  return apiGet<any[]>('/api/ads');
}

export async function updateAdStatus(id: string, status: string): Promise<void> {
  return apiPut(`/api/ads/${id}`, { status });
}

/* ─────── COURSES ─────── */
export async function fetchCourses(): Promise<any[]> {
  return apiGet<any[]>('/api/courses');
}

export async function createCourse(data: any): Promise<any> {
  return apiPost('/api/courses', data);
}

export async function updateCourse(id: string, data: any): Promise<void> {
  return apiPut(`/api/courses/${id}`, data);
}

export async function deleteCourse(id: string): Promise<void> {
  return apiDelete(`/api/courses/${id}`);
}

/* ─────── VIDEOS / BROADCASTS ─────── */
export async function fetchVideos(): Promise<any[]> {
  return apiGet<any[]>('/api/videos');
}

export async function createVideo(data: any): Promise<any> {
  return apiPost('/api/videos', data);
}

export async function updateVideo(id: string, data: any): Promise<void> {
  return apiPut(`/api/videos/${id}`, data);
}

export async function deleteVideo(id: string): Promise<void> {
  return apiDelete(`/api/videos/${id}`);
}

/* ─────── RTTI ─────── */
export async function fetchRttiData(): Promise<RttiData> {
  return apiGet<RttiData>('/api/rtti/dashboard');
}

export async function signup(data: {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: string;
}): Promise<{ success: boolean; message: string }> {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) {
    return { success: false, message: 'Email already registered.' };
  }
  if (users.find(u => u.username === data.username)) {
    return { success: false, message: 'Username already taken.' };
  }
  const user: StoredUser = {
    id: generateId(),
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    username: data.username,
    password: data.password,
    role: data.role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return { success: true, message: 'Account created successfully.' };
}

export async function signin(identifier: string, password: string): Promise<{
  success: boolean;
  message: string;
  user?: { email: string; name: string; role: string };
}> {
  const users = getUsers();
  const user = users.find(
    u =>
      (u.email === identifier || u.username === identifier || u.phone === identifier) &&
      u.password === password
  );
  if (!user) {
    return { success: false, message: 'Invalid credentials. Check your identifier and password.' };
  }
  return {
    success: true,
    message: 'Authentication validated.',
    user: { email: user.email, name: user.fullName, role: user.role },
  };
}

export async function checkUserExists(identifier: string): Promise<{
  exists: boolean;
  message: string;
}> {
  const users = getUsers();
  const user = users.find(u => u.email === identifier || u.username === identifier || u.phone === identifier);
  if (!user) {
    return { exists: false, message: 'No account found with that email, username, or phone.' };
  }
  return { exists: true, message: 'Account found.' };
}

export async function checkUsername(username: string): Promise<{
  available: boolean;
  message: string;
  suggestions?: string[];
}> {
  const users = getUsers();
  const taken = users.find(u => u.username === username);
  if (!taken) {
    return { available: true, message: 'Username is available.' };
  }
  const suggestions = users
    .map(u => u.username)
    .filter(u => u.includes(username.slice(0, 3)))
    .slice(0, 3);
  const fallback = `${username}_${Math.floor(10 + Math.random() * 89)}`;
  return {
    available: false,
    message: 'Username is already taken.',
    suggestions: suggestions.length > 0 ? [...suggestions, fallback] : [fallback],
  };
}

export async function sendOtp(identifier: string): Promise<{
  success: boolean;
  otp: string;
  message: string;
}> {
  const users = getUsers();
  const user = users.find(u => u.email === identifier || u.username === identifier || u.phone === identifier);
  const otpKey = user ? user.email : 'otp_' + identifier;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem('otp_' + otpKey, otp);
  setTimeout(() => localStorage.removeItem('otp_' + otpKey), 300000);
  return {
    success: true,
    otp,
    message: `OTP ${otp} sent to your registered contact method. (DEBUG: ${otp})`,
  };
}

export async function verifyOtp(identifier: string, otp: string): Promise<{
  success: boolean;
  message: string;
}> {
  const users = getUsers();
  const user = users.find(u => u.email === identifier || u.username === identifier || u.phone === identifier);
  const otpKey = user ? user.email : 'otp_' + identifier;
  const stored = localStorage.getItem('otp_' + otpKey);
  if (stored === otp) {
    localStorage.removeItem('otp_' + otpKey);
    return { success: true, message: 'OTP verified successfully.' };
  }
  return { success: false, message: 'Invalid or expired OTP.' };
}

export async function resetPassword(identifier: string, newPassword: string): Promise<{
  success: boolean;
  message: string;
}> {
  const users = getUsers();
  const idx = users.findIndex(u => u.email === identifier || u.username === identifier || u.phone === identifier);
  if (idx === -1) {
    return { success: false, message: 'Account not found.' };
  }
  users[idx].password = newPassword;
  saveUsers(users);
  return { success: true, message: 'Password updated successfully.' };
}
