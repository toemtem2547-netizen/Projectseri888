import type { User, Transaction, WatchHistoryItem } from "@/types";

export const users: User[] = [
  { id: "1", name: "Sarah Mitchell", email: "sarah@example.com", avatarUrl: "", plan: "premium", joinDate: "2024-01-15", status: "active" },
  { id: "2", name: "David Park", email: "david@example.com", avatarUrl: "", plan: "ultra", joinDate: "2023-11-20", status: "active" },
  { id: "3", name: "Maria Santos", email: "maria@example.com", avatarUrl: "", plan: "basic", joinDate: "2024-06-05", status: "active" },
  { id: "4", name: "James Wilson", email: "james@example.com", avatarUrl: "", plan: "free", joinDate: "2025-01-10", status: "active" },
  { id: "5", name: "Yuki Tanaka", email: "yuki@example.com", avatarUrl: "", plan: "premium", joinDate: "2024-03-22", status: "active" },
  { id: "6", name: "Alex Rivera", email: "alex@example.com", avatarUrl: "", plan: "basic", joinDate: "2024-09-14", status: "inactive" },
  { id: "7", name: "Emma Johnson", email: "emma@example.com", avatarUrl: "", plan: "ultra", joinDate: "2023-08-30", status: "active" },
  { id: "8", name: "Liu Wei", email: "liu@example.com", avatarUrl: "", plan: "premium", joinDate: "2024-04-18", status: "active" },
  { id: "9", name: "Priya Sharma", email: "priya@example.com", avatarUrl: "", plan: "free", joinDate: "2025-02-28", status: "active" },
  { id: "10", name: "Tom Anderson", email: "tom@example.com", avatarUrl: "", plan: "basic", joinDate: "2024-12-01", status: "suspended" },
];

export const currentUser: User = users[0];

export const transactions: Transaction[] = [
  { id: "t1", userId: "1", movieId: "1", movieTitle: "Echoes of Eternity", type: "purchase", amount: 14.99, date: "2025-06-28", status: "completed", paymentMethod: "Visa •••• 4242" },
  { id: "t2", userId: "2", movieId: "6", movieTitle: "Neon Dynasty", type: "rental", amount: 5.99, date: "2025-06-27", status: "completed", paymentMethod: "Mastercard •••• 8888" },
  { id: "t3", userId: "3", movieId: "5", movieTitle: "Golden Hour", type: "rental", amount: 5.99, date: "2025-06-27", status: "completed", paymentMethod: "PayPal" },
  { id: "t4", userId: "1", movieId: "13", movieTitle: "Fractured Realms", type: "purchase", amount: 16.99, date: "2025-06-26", status: "completed", paymentMethod: "Visa •••• 4242" },
  { id: "t5", userId: "4", movieId: "3", movieTitle: "Crimson Tide Rising", type: "rental", amount: 4.99, date: "2025-06-26", status: "completed", paymentMethod: "Apple Pay" },
  { id: "t6", userId: "5", movieId: "15", movieTitle: "The Dragon's Apprentice", type: "purchase", amount: 17.99, date: "2025-06-25", status: "completed", paymentMethod: "Visa •••• 1234" },
  { id: "t7", userId: "2", movieId: "2", movieTitle: "The Last Frontier", type: "subscription", amount: 9.99, date: "2025-06-25", status: "completed", paymentMethod: "Mastercard •••• 8888" },
  { id: "t8", userId: "6", movieId: "10", movieTitle: "The Confession Room", type: "rental", amount: 5.99, date: "2025-06-24", status: "refunded", paymentMethod: "PayPal" },
  { id: "t9", userId: "7", movieId: "9", movieTitle: "Starbloom Garden", type: "purchase", amount: 11.99, date: "2025-06-24", status: "completed", paymentMethod: "Apple Pay" },
  { id: "t10", userId: "8", movieId: "18", movieTitle: "The Heist of Hearts", type: "rental", amount: 5.99, date: "2025-06-23", status: "completed", paymentMethod: "Visa •••• 5678" },
  { id: "t11", userId: "1", movieId: "8", movieTitle: "Phantom Protocol", type: "rental", amount: 6.99, date: "2025-06-23", status: "completed", paymentMethod: "Visa •••• 4242" },
  { id: "t12", userId: "9", movieId: "12", movieTitle: "Laughing Thunder", type: "rental", amount: 3.99, date: "2025-06-22", status: "pending", paymentMethod: "Google Pay" },
  { id: "t13", userId: "3", movieId: "20", movieTitle: "Seoul Train", type: "purchase", amount: 14.99, date: "2025-06-22", status: "completed", paymentMethod: "PayPal" },
  { id: "t14", userId: "5", movieId: "4", movieTitle: "Whispers in the Dark", type: "rental", amount: 4.99, date: "2025-06-21", status: "completed", paymentMethod: "Visa •••• 1234" },
  { id: "t15", userId: "10", movieId: "11", movieTitle: "Emerald Coast", type: "rental", amount: 5.99, date: "2025-06-20", status: "refunded", paymentMethod: "Mastercard •••• 3333" },
];

export const watchHistory: WatchHistoryItem[] = [
  { movieId: "1", movieTitle: "Echoes of Eternity", posterUrl: "https://picsum.photos/seed/movie1/400/600", progress: 65, lastWatched: "2025-06-28", duration: "2h 18m" },
  { movieId: "6", movieTitle: "Neon Dynasty", posterUrl: "https://picsum.photos/seed/movie6/400/600", progress: 30, lastWatched: "2025-06-27", duration: "2h 12m" },
  { movieId: "13", movieTitle: "Fractured Realms", posterUrl: "https://picsum.photos/seed/movie13/400/600", progress: 85, lastWatched: "2025-06-26", duration: "2h 28m" },
  { movieId: "5", movieTitle: "Golden Hour", posterUrl: "https://picsum.photos/seed/movie5/400/600", progress: 100, lastWatched: "2025-06-25", duration: "1h 48m" },
  { movieId: "15", movieTitle: "The Dragon's Apprentice", posterUrl: "https://picsum.photos/seed/movie15/400/600", progress: 15, lastWatched: "2025-06-24", duration: "2h 42m" },
];

export const favoriteMovieIds = ["1", "5", "6", "9", "13", "15", "20"];

export const purchasedMovieIds = ["1", "5", "13", "15", "20"];

export const adminStats = {
  totalRevenue: 284750,
  revenueChange: 12.5,
  activeUsers: 45892,
  userChange: 8.3,
  totalRentals: 12456,
  rentalChange: 15.2,
  subscriptions: 8934,
  subChange: 6.7,
};

export const monthlyRevenue = [
  { month: "Jan", revenue: 18500, rentals: 890, subscriptions: 620 },
  { month: "Feb", revenue: 21200, rentals: 1020, subscriptions: 680 },
  { month: "Mar", revenue: 19800, rentals: 950, subscriptions: 710 },
  { month: "Apr", revenue: 24500, rentals: 1180, subscriptions: 750 },
  { month: "May", revenue: 28900, rentals: 1390, subscriptions: 820 },
  { month: "Jun", revenue: 32100, rentals: 1545, subscriptions: 890 },
  { month: "Jul", revenue: 29400, rentals: 1415, subscriptions: 870 },
  { month: "Aug", revenue: 27800, rentals: 1340, subscriptions: 850 },
  { month: "Sep", revenue: 31200, rentals: 1505, subscriptions: 910 },
  { month: "Oct", revenue: 34500, rentals: 1660, subscriptions: 940 },
  { month: "Nov", revenue: 38200, rentals: 1840, subscriptions: 990 },
  { month: "Dec", revenue: 42800, rentals: 2060, subscriptions: 1050 },
];
