// Mock data for development - will be replaced with Supabase later

export interface Winner {
  id: string;
  name: string;
  city: string;
  prize: string;
  month: string;
  year: number;
  avatarUrl?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tier: 'grand' | 'first' | 'second' | 'consolation';
}

export interface UniqueCode {
  id: string;
  code: string;
  isRedeemed: boolean;
  redeemedBy?: string;
  redeemedAt?: string;
  month: string;
  year: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  entriesThisMonth: number;
}

// Current month's rewards
export const currentRewards: Reward[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max',
    description: 'The ultimate smartphone experience',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    tier: 'grand',
  },
  {
    id: '2',
    title: 'Sony PlayStation 5',
    description: 'Next-gen gaming console',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
    tier: 'first',
  },
  {
    id: '3',
    title: 'Apple AirPods Pro',
    description: 'Premium wireless earbuds',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop',
    tier: 'second',
  },
  {
    id: '4',
    title: 'Shareat Gift Hamper',
    description: 'Exclusive snack collection worth ₹5000',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    tier: 'consolation',
  },
];

// Past winners
export const pastWinners: Winner[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    city: 'Mumbai',
    prize: 'iPhone 15 Pro Max',
    month: 'November',
    year: 2024,
  },
  {
    id: '2',
    name: 'Priya Patel',
    city: 'Delhi',
    prize: 'Sony PlayStation 5',
    month: 'November',
    year: 2024,
  },
  {
    id: '3',
    name: 'Amit Kumar',
    city: 'Bangalore',
    prize: 'Apple AirPods Pro',
    month: 'November',
    year: 2024,
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    city: 'Hyderabad',
    prize: 'Shareat Gift Hamper',
    month: 'October',
    year: 2024,
  },
  {
    id: '5',
    name: 'Vikram Singh',
    city: 'Jaipur',
    prize: 'Samsung Galaxy Watch',
    month: 'October',
    year: 2024,
  },
];

// Valid codes for testing
export const validCodes: UniqueCode[] = [
  { id: '1', code: 'SHAREAT2024A1', isRedeemed: false, month: 'December', year: 2024 },
  { id: '2', code: 'SHAREAT2024B2', isRedeemed: false, month: 'December', year: 2024 },
  { id: '3', code: 'SHAREAT2024C3', isRedeemed: false, month: 'December', year: 2024 },
  { id: '4', code: 'SHAREAT2024D4', isRedeemed: true, redeemedBy: 'user1', redeemedAt: '2024-12-01', month: 'December', year: 2024 },
  { id: '5', code: 'LUCKY123', isRedeemed: false, month: 'December', year: 2024 },
  { id: '6', code: 'WIN2024', isRedeemed: false, month: 'December', year: 2024 },
];

// Mock current user
export const mockUser: User = {
  id: 'user1',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+91 9876543210',
  city: 'Mumbai',
  entriesThisMonth: 3,
};
