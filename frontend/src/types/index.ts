// ═══════════════════════════════════════════════════════════════
// CineVault — TypeScript Type Definitions
// ═══════════════════════════════════════════════════════════════

export interface Movie {
  id: string;
  title: string;
  tagline?: string | null;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string | null;
  year?: number | null;
  duration?: string | null;
  rating?: number | null;
  ratingCount?: number | null;
  genres?: string | string[] | null;
  director?: string | null;
  cast?: CastMember[] | any | null;
  country?: string | null;
  language?: string | null;
  previewDuration?: number | null; // seconds
  price24h?: number | null;
  purchasePrice?: number | null;
  isNew?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  releaseDate?: string | null;
  contentType?: "movie" | "series";
  type?: string;
  videoUrl?: string | null;
}

export interface Series extends Movie {
  seasons: Season[];
  totalEpisodes: number;
}

export interface Season {
  number: number;
  title: string;
  episodes: Episode[];
  price: number;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  price: number;
}

export interface CastMember {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Genre {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: "free" | "basic" | "premium" | "ultra";
  joinDate: string;
  status: "active" | "inactive" | "suspended";
}

export interface Transaction {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  type: "rental" | "purchase" | "subscription";
  amount: number;
  date: string;
  status: "completed" | "pending" | "refunded";
  paymentMethod: string;
}

export interface RentalOption {
  id: string;
  type: "rent" | "buy_episode" | "buy_season" | "subscribe";
  label: string;
  description: string;
  price: number;
  duration?: string;
  features: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular: boolean;
  color: string;
}

export interface WatchHistoryItem {
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  progress: number; // 0-100
  lastWatched: string;
  duration: string;
}

export interface FilterState {
  genres: string[];
  country: string;
  yearRange: [number, number];
  minRating: number;
  sortBy: "popularity" | "rating" | "newest" | "price";
  layout: "grid" | "cinematic";
}

export interface AdminStats {
  totalRevenue: number;
  revenueChange: number;
  activeUsers: number;
  userChange: number;
  totalRentals: number;
  rentalChange: number;
  subscriptions: number;
  subChange: number;
}
