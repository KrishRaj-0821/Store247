import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJSON<T>(file: string): T {
  const filePath = path.join(DATA_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function writeJSON<T>(file: string, data: T): void {
  const filePath = path.join(DATA_DIR, file);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.warn(`[WARN] Serverless environment: unable to write to ${filePath}. In-memory fallback is active for this session only.`);
  }
}


// ─── Products ─────────────────────────────────────────────────────────────────
export function getProducts() {
  return readJSON<Product[]>('products.json');
}

export function getProductById(id: string) {
  const products = getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export function getProductBySlug(slug: string) {
  const products = getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export function createProduct(product: Product) {
  const products = getProducts();
  products.push(product);
  writeJSON('products.json', products);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  writeJSON('products.json', products);
  return products[idx];
}

export function deleteProduct(id: string) {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  writeJSON('products.json', filtered);
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export function getOrders() {
  return readJSON<Order[]>('orders.json');
}

export function getOrderById(id: string) {
  return getOrders().find((o) => o.id === id) ?? null;
}

export function getOrdersByUser(userId: string) {
  return getOrders().filter((o) => o.userId === userId);
}

export function createOrder(order: Order) {
  const orders = getOrders();
  orders.push(order);
  writeJSON('orders.json', orders);
  return order;
}

export function updateOrder(id: string, updates: Partial<Order>) {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...updates };
  writeJSON('orders.json', orders);
  return orders[idx];
}

// ─── Users ────────────────────────────────────────────────────────────────────
export function getUsers() {
  return readJSON<User[]>('users.json');
}

export function getUserById(id: string) {
  return getUsers().find((u) => u.id === id) ?? null;
}

export function getUserByPhone(phone: string) {
  return getUsers().find((u) => u.phone === phone) ?? null;
}

export function getUserByEmail(email: string) {
  return getUsers().find((u) => u.email === email) ?? null;
}

export function createUser(user: User) {
  const users = getUsers();
  users.push(user);
  writeJSON('users.json', users);
  return user;
}

export function updateUser(id: string, updates: Partial<User>) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  writeJSON('users.json', users);
  return users[idx];
}

// ─── Community ────────────────────────────────────────────────────────────────
export function getCommunityPosts() {
  return readJSON<CommunityPost[]>('community.json');
}

export function createCommunityPost(post: CommunityPost) {
  const posts = getCommunityPosts();
  posts.unshift(post);
  writeJSON('community.json', posts);
  return post;
}

export function updateCommunityPost(id: string, updates: Partial<CommunityPost>) {
  const posts = getCommunityPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...updates };
  writeJSON('community.json', posts);
  return posts[idx];
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  unit: string;
  image: string;
  tags: string[];
  rating: number;
  reviews: number;
  priceHistory: { price: number; date: string }[];
  featured: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  unit: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: 'Placed' | 'Confirmed' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  address: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  timeline: { status: string; time: string }[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone: string;
  membership: 'Standard' | 'Prime' | 'VIP';
  loyaltyPoints: number;
  avatar: string;
  addresses: Address[];
  role: 'customer' | 'admin';
  password?: string;
  createdAt: string;
  approved: boolean;
}

export interface CommunityPost {
  id: string;
  type: 'announcement' | 'post';
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  image: string;
  likes: number;
  comments: { id: string; userId: string; userName: string; text: string; createdAt: string }[];
  pinned: boolean;
  createdAt: string;
}
