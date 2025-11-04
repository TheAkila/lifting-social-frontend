// Product Types
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  category: ProductCategory
  subcategory?: string
  sizes: Size[]
  colors?: Color[]
  images: string[]
  inStock: boolean
  stockCount: number
  featured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Size {
  name: string
  value: string
  inStock: boolean
}

export interface Color {
  name: string
  hex: string
  inStock: boolean
}

export type ProductCategory = 'apparel' | 'accessories' | 'equipment' | 'merchandise'

// Athlete Types
export interface Athlete {
  id: string
  name: string
  slug: string
  category: string // Weight category (e.g., "73kg", "81kg")
  bio: string
  achievements: Achievement[]
  medals: Medal[]
  stats: AthleteStats
  avatar: string
  coverImage: string
  featured: boolean
  socialMedia: SocialMedia
  videos: Video[]
  createdAt: string
  updatedAt: string
}

export interface Achievement {
  title: string
  year: number
  description: string
}

export interface Medal {
  type: 'gold' | 'silver' | 'bronze'
  event: string
  year: number
  location: string
}

export interface AthleteStats {
  snatch: number
  cleanAndJerk: number
  total: number
  bodyweight: number
}

export interface Video {
  id: string
  title: string
  url: string
  thumbnail: string
  type: 'youtube' | 'vimeo' | 'custom'
}

// Story/Blog Types
export interface Story {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: Author
  category: StoryCategory
  tags: string[]
  coverImage: string
  publishedAt: string
  readTime: string
  featured: boolean
  views: number
}

export interface Author {
  id: string
  name: string
  avatar: string
  bio: string
}

export type StoryCategory = 'athlete-story' | 'training' | 'events' | 'news' | 'tutorial'

// Coach Types
export interface Coach {
  id: string
  name: string
  slug: string
  bio: string
  specializations: string[]
  experience: string
  certifications: Certification[]
  avatar: string
  contactEmail: string
  contactPhone: string
  availability: string
  featured: boolean
}

export interface Certification {
  name: string
  organization: string
  year: number
}

// Event Types
export interface Event {
  id: string
  title: string
  slug: string
  description: string
  date: string
  endDate?: string
  location: string
  venue: string
  type: EventType
  coverImage: string
  registrationUrl?: string
  featured: boolean
}

export type EventType = 'competition' | 'workshop' | 'seminar' | 'social'

// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  phone?: string
  address?: Address
  createdAt: string
}

export type UserRole = 'user' | 'admin' | 'coach' | 'athlete'

export interface Address {
  street: string
  city: string
  province: string
  postalCode: string
  country: string
}

// Order Types
export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: string
  paymentStatus: PaymentStatus
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  size: string
  color?: string
  quantity: number
  price: number
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

// Social Media
export interface SocialMedia {
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  tiktok?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
