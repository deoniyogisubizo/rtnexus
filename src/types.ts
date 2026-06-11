/**
 * RT Nexus - Core Types
 */

export type UserRole = 'visitor' | 'customer' | 'student' | 'instructor' | 'vendor' | 'advertiser' | 'admin' | 'all';

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  token?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  vendorName: string;
  stock: number;
  videoUrl?: string;
  guideBook?: string;
  whereToUse?: string;
  specTable?: string[][];
  images?: string[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  rating: number;
  studentsCount: number;
  price: number;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  syllabus: string[];
  certified: boolean;
  images?: string[];
}

export interface Broadcast {
  id: string;
  title: string;
  type: 'live' | 'webinar' | 'podcast' | 'tutorial';
  host: string;
  scheduledTime?: string;
  views: number;
  thumbnail: string;
  duration?: string;
  description: string;
  category: string;
}

export interface OpenPosition {
  id: string;
  title: string;
  department: 'Engineering' | 'Learning Paths' | 'Media' | 'Marketing' | 'Operations';
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdCampaignEstimate {
  placement: 'homepage' | 'shop_featured' | 'mttv_video_roll' | 'newsletter';
  durationDays: number;
  budget: number;
  estimatedImpressions: number;
  estimatedClicks: number;
}

export interface RttiData {
  totalStudents: number;
  totalCourses: number;
  totalTeachers: number;
  activeCertificates: number;
  avgCompletion: number;
}
