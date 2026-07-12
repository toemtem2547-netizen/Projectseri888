import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear existing data (optional, but good for a fresh start)
  await prisma.watchHistory.deleteMany({});
  await prisma.watchlist.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.rental.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.episode.deleteMany({});
  await prisma.movie.deleteMany({});
  
  console.log("Cleared existing data.");

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash("password123", 10);
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin SuperUser",
      email: "admin@cinevault.com",
      password: hashedPassword,
      role: "ADMIN",
      image: "https://i.pravatar.cc/150?u=admin",
    },
  });

  console.log(`Created admin user: ${adminUser.email}`);

  // 3. Create Dummy Movies
  const movies = [
    {
      title: "The Silent Echo",
      description: "A gripping thriller about a detective who must solve a series of crimes that mirror a case from his past. As he delves deeper, the line between reality and memory begins to blur.",
      posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop",
      backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      type: "MOVIE",
      genres: "Thriller, Crime, Drama",
      rating: 4.8,
      ratingCount: 12450,
      year: 2024,
      duration: "135m",
      director: "Jonathan Price",
      cast: "Robert Vance, Sarah Jenkins, Liam O'Connor",
      language: "English",
      country: "USA",
      releaseDate: "2024-05-12",
      isNew: true,
      isFeatured: true,
      price24h: 99.00,
      price7d: 199.00,
      priceLifetime: 499.00,
    },
    {
      title: "Neon Horizon",
      description: "In a cyberpunk future, a rogue hacker discovers a conspiracy that could bring down the entire megacorporation controlling the city's resources.",
      posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
      backdropUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1920&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      type: "MOVIE",
      genres: "Sci-Fi, Action",
      rating: 4.5,
      ratingCount: 8900,
      year: 2025,
      duration: "112m",
      director: "Elena Rodriguez",
      cast: "Maya Lin, Kaelen Stone",
      language: "English",
      country: "USA",
      releaseDate: "2025-01-20",
      isNew: true,
      isFeatured: false,
      price24h: 129.00,
      price7d: 259.00,
      priceLifetime: 599.00,
    },
    {
      title: "Whispers in the Wind",
      description: "A touching drama about a family trying to reconnect after a tragedy, set against the beautiful backdrop of the Scottish Highlands.",
      posterUrl: "https://images.unsplash.com/photo-1440407876336-62333a6f010f?q=80&w=800&auto=format&fit=crop",
      backdropUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      type: "MOVIE",
      genres: "Drama, Romance",
      rating: 4.2,
      ratingCount: 5600,
      year: 2023,
      duration: "105m",
      director: "Alistair Macleod",
      cast: "Fiona Stewart, James Fraser",
      language: "English",
      country: "UK",
      releaseDate: "2023-11-05",
      isNew: false,
      isFeatured: false,
      price24h: 79.00,
      price7d: 149.00,
      priceLifetime: 399.00,
    },
    {
      title: "Cosmic Odyssey",
      description: "An epic documentary series exploring the farthest reaches of our universe, narrated by a leading astrophysicist.",
      posterUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop",
      backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1920&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      type: "SERIES",
      genres: "Documentary, Science",
      rating: 4.9,
      ratingCount: 22000,
      year: 2024,
      duration: "6 Episodes",
      director: "National Science Foundation",
      cast: "Dr. Neil Tyson (Narrator)",
      language: "English",
      country: "USA",
      releaseDate: "2024-08-15",
      isNew: true,
      isFeatured: true,
      price24h: 0.00,
      price7d: 0.00,
      priceLifetime: 299.00,
    },
  ];

  console.log("Creating movies...");
  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    });
  }
  
  console.log(`Created ${movies.length} movies.`);
  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
