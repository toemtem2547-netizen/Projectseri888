const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const movies = [
  {
    title: "Echoes of Eternity",
    tagline: "Some echoes never fade",
    description: "In a world where memories can be extracted and traded, a former memory thief must navigate a web of deceit when she discovers her own memories have been stolen.",
    posterUrl: "https://picsum.photos/seed/movie1/400/600",
    backdropUrl: "https://picsum.photos/seed/movie1bg/1920/1080",
    trailerUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    year: 2025,
    duration: "2h 18m",
    rating: 4.8,
    ratingCount: 12453,
    genres: "Sci-Fi, Thriller",
    director: "Aria Chen",
    cast: "Elena Voss, Marcus Chen, Sofia Reyes",
    country: "United States",
    language: "English",
    previewDuration: 120,
    price24h: 5.99,
    price7d: 8.99,
    priceLifetime: 14.99,
    isNew: true,
    releaseDate: "2025-03-15",
  },
  {
    title: "The Last Frontier",
    tagline: "Beyond the edge of the known",
    description: "A crew of elite astronauts embarks on humanity's most ambitious deep-space mission, only to discover that the frontier they seek holds secrets about Earth's own origins.",
    posterUrl: "https://picsum.photos/seed/movie2/400/600",
    backdropUrl: "https://picsum.photos/seed/movie2bg/1920/1080",
    trailerUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    year: 2025,
    duration: "2h 35m",
    rating: 4.6,
    ratingCount: 8721,
    genres: "Sci-Fi, Drama",
    director: "Viktor Petrov",
    cast: "Elena Voss, Marcus Chen, Sofia Reyes",
    country: "United States",
    language: "English",
    previewDuration: 120,
    price24h: 6.99,
    price7d: 10.99,
    priceLifetime: 16.99,
    isNew: true,
    releaseDate: "2025-05-22",
  },
  {
    title: "Neon Dynasty",
    tagline: "In the neon jungle, only the smart survive",
    description: "Set in a cyberpunk Seoul of 2089, a street-smart hacker must infiltrate the most powerful megacorporation to clear her brother's name.",
    posterUrl: "https://picsum.photos/seed/movie6/400/600",
    backdropUrl: "https://picsum.photos/seed/movie6bg/1920/1080",
    trailerUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    year: 2024,
    duration: "2h 12m",
    rating: 4.4,
    ratingCount: 18932,
    genres: "Action, Sci-Fi",
    director: "Park Jun-seo",
    cast: "Elena Voss, Marcus Chen",
    country: "South Korea",
    language: "Korean",
    previewDuration: 120,
    price24h: 5.99,
    price7d: 8.99,
    priceLifetime: 14.99,
    isNew: false,
    releaseDate: "2024-08-30",
  },
  {
    title: "Whispers in the Dark",
    tagline: "Listen carefully. Your life depends on it.",
    description: "A deaf woman moves into an old Victorian house and begins receiving mysterious vibrations through the floorboards.",
    posterUrl: "https://picsum.photos/seed/movie4/400/600",
    backdropUrl: "https://picsum.photos/seed/movie4bg/1920/1080",
    trailerUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    year: 2025,
    duration: "1h 52m",
    rating: 4.5,
    ratingCount: 9841,
    genres: "Horror, Mystery",
    director: "Tomoko Hayashi",
    cast: "Elena Voss",
    country: "Japan",
    language: "English",
    previewDuration: 120,
    price24h: 4.99,
    price7d: 7.99,
    priceLifetime: 11.99,
    isNew: true,
    releaseDate: "2025-01-20",
  }
];

async function main() {
  console.log("Starting seed...");
  await prisma.movie.deleteMany(); // Clear existing movies
  
  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    });
  }
  
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
