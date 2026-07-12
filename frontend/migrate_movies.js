const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { movies } = require('./src/lib/data/movies');

async function main() {
  let added = 0;
  for (const m of movies) {
    const exists = await prisma.movie.findFirst({ where: { title: m.title } });
    if (!exists) {
      await prisma.movie.create({
        data: {
          id: m.id,
          type: m.type === "series" ? "SERIES" : "MOVIE",
          title: m.title,
          description: m.description,
          posterUrl: m.posterUrl,
          backdropUrl: m.backdropUrl,
          trailerUrl: m.trailerUrl || "",
          videoUrl: m.videoUrl || "",
          tagline: m.tagline || "",
          genres: m.genres.join(", "),
          rating: m.rating,
          ratingCount: Number(m.ratingCount) || 0,
          year: parseInt(m.year) || 2024,
          duration: m.duration,
          director: m.director,
          cast: Array.isArray(m.cast) ? m.cast.map(c => c.name).join(", ") : "",
          country: m.country,
          releaseDate: "2024-01-01",
          previewDuration: m.previewDuration || 120,
          price24h: m.rentalOptions ? m.rentalOptions.find(o => o.id === "24h")?.price || 59 : 59,
          price7d: m.rentalOptions ? m.rentalOptions.find(o => o.id === "7d")?.price || 99 : 99,
          priceLifetime: m.rentalOptions ? m.rentalOptions.find(o => o.id === "lifetime")?.price || 299 : 299,
          isNew: m.isNew || false,
          isFeatured: m.isFeatured || false,
        }
      });
      added++;
    }
  }
  console.log(`Migrated ${added} movies from mock data to DB.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
