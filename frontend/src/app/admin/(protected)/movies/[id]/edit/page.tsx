import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import MovieEditForm from "./MovieEditForm";

export default async function AdminMovieEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    return notFound();
  }

  return <MovieEditForm movie={movie} />;
}
