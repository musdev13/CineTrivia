import { api } from "./base";
import type { TMDBMovie, CastMember } from "./types";

// Запит на отримання списку популярних фільмів (завантажуємо кілька сторінок для різноманітності)
export const fetchPopularMovies = async (page = 1): Promise<TMDBMovie[]> => {
  const response = await api.get<{ results: TMDBMovie[] }>("/movie/popular", {
    params: {
      page,
      language: "uk-UA", // спроба отримати українські назви
      region: "UA",
    },
  });
  return response.data.results;
};

// Отримання акторського складу конкретного фільму
export const fetchMovieCredits = async (
  movieId: number,
): Promise<CastMember[]> => {
  const response = await api.get<{ cast: CastMember[] }>(
    `/movie/${movieId}/credits`,
    {
      params: {
        language: "uk-UA",
      },
    },
  );
  return response.data.cast;
};

// Допоміжний запит для пошуку додаткових деталей (наприклад, кадрів до фільму)
export const fetchMovieImages = async (movieId: number): Promise<string[]> => {
  const response = await api.get<{ backdrops: { file_path: string }[] }>(
    `/movie/${movieId}/images`,
  );
  return response.data.backdrops.map((img) => img.file_path);
};

export const getImageUrl = (path: string | null, size = "w500") => {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};