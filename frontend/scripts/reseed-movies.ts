import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Restoring some movies...");

  const movies = [
    {
      title: "ซีรีส์จีนแนวตั้ง (กู้คืน)",
      description: "ซีรีส์จีนที่คุณเพิ่มเข้ามาเมื่อสักครู่ ผมกู้คืนให้แล้วครับ!",
      posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop",
      backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop",
      trailerUrl: "https://vidara.to/v/rxiLSR030z9OO",
      videoUrl: "https://vidara.to/v/rxiLSR030z9OO",
      type: "SERIES",
      genres: "Drama, Romance",
      rating: 4.8,
      ratingCount: 12450,
      year: 2024,
      duration: "135m",
      director: "Unknown",
      cast: "Unknown",
      language: "Chinese",
      country: "China",
      releaseDate: "2024-05-12",
      isNew: true,
      isFeatured: true,
      price24h: 99.00,
      price7d: 199.00,
      priceLifetime: 499.00,
    },
    {
      title: "ภาพยนตร์ (กู้คืน)",
      description: "ภาพยนตร์อีกเรื่องที่คุณส่งลิงก์มาให้",
      posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
      backdropUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1920&auto=format&fit=crop",
      trailerUrl: "https://vidara.to/e/aINdUbzeXUbZY",
      videoUrl: "https://vidara.to/e/aINdUbzeXUbZY",
      type: "MOVIE",
      genres: "Action, Thriller",
      rating: 4.5,
      ratingCount: 8900,
      year: 2025,
      duration: "112m",
      director: "Unknown",
      cast: "Unknown",
      language: "English",
      country: "USA",
      releaseDate: "2025-01-20",
      isNew: true,
      isFeatured: true,
      price24h: 129.00,
      price7d: 259.00,
      priceLifetime: 599.00,
    },
    {
      title: "The Silent Echo (Mockup)",
      description: "A gripping thriller about a detective who must solve a series of crimes that mirror a case from his past.",
      posterUrl: "https://images.unsplash.com/photo-1440407876336-62333a6f010f?q=80&w=800&auto=format&fit=crop",
      backdropUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop",
      trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      type: "MOVIE",
      genres: "Drama",
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
    }
  ];

  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    });
  }
  console.log("Restored movies successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
