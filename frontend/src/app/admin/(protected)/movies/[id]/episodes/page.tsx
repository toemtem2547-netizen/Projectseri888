import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EpisodeManagerClient from "./EpisodeManagerClient";

export default async function AdminEpisodesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      episodes: {
        orderBy: { epNumber: "asc" }
      }
    }
  });

  if (!movie || movie.type !== "SERIES") {
    return notFound();
  }

  return <EpisodeManagerClient movie={movie} episodes={movie.episodes} />;
}
