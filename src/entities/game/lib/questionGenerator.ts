import { fetchMovieCredits } from "@/shared/api";
import type { TMDBMovie } from "@/shared/api";
import type { QuizQuestion, GameMode } from "../model/types";

// Перемішування елементів масиву (алгоритм Фішера-Єйтса)
export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Генерація варіантів відповідей (1 правильна + 3 випадкові назви з пулу)
const generateOptions = (
  correctTitle: string,
  allMovies: TMDBMovie[],
): string[] => {
  const options = new Set<string>();
  options.add(correctTitle);

  const maxAttempts = 30;
  let attempts = 0;

  while (options.size < 4 && attempts < maxAttempts) {
    const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];
    if (randomMovie.title && randomMovie.title.trim() !== "") {
      options.add(randomMovie.title);
    }
    attempts++;
  }

  return shuffleArray(Array.from(options));
};

// Генерація одного запитання
export const generateQuestion = async (
  movie: TMDBMovie,
  allMovies: TMDBMovie[],
  forceType?: "poster" | "cast" | "backdrop",
): Promise<QuizQuestion> => {
  // Визначаємо тип підказки (випадковий або примусовий)
  const availableTypes: ("poster" | "cast" | "backdrop")[] = [
    "poster",
    "cast",
    "backdrop",
  ];
  const type =
    forceType ||
    availableTypes[Math.floor(Math.random() * availableTypes.length)];

  let castNames: string[] = [];
  let backdropPath = movie.backdrop_path;

  // Якщо режим вгадування акторів, завантажуємо каст з TMDB API
  if (type === "cast") {
    try {
      const cast = await fetchMovieCredits(movie.id);
      // Беремо топ-4 акторів
      castNames = cast.slice(0, 4).map((c) => c.name);
    } catch (e) {
      console.error(
        "Не вдалося завантажити акторів для фільму",
        movie.title,
        e,
      );
      castNames = ["Невідомий актор"];
    }
  }

  return {
    id: `${movie.id}-${Date.now()}-${Math.random()}`,
    movie,
    type,
    options: generateOptions(movie.title, allMovies),
    castNames,
    backdropPath,
    correctAnswer: movie.title,
    originalTitle: movie.original_title,
  };
};

// Створення всього списку запитань для сесії
export const generateQuizSession = async (
  moviesPool: TMDBMovie[],
  mode: GameMode,
  count = 15,
): Promise<QuizQuestion[]> => {
  // Перемішуємо фільми з пулу
  const shuffledPool = shuffleArray(moviesPool);
  const selectedMovies = shuffledPool.slice(0, count);

  const questions: QuizQuestion[] = [];

  for (const movie of selectedMovies) {
    let questionType: "poster" | "cast" | "backdrop";
    if (mode === "mixed") {
      const types: ("poster" | "cast" | "backdrop")[] = [
        "poster",
        "cast",
        "backdrop",
      ];
      questionType = types[Math.floor(Math.random() * types.length)];
    } else {
      questionType = mode;
    }

    const question = await generateQuestion(movie, moviesPool, questionType);
    questions.push(question);
  }

  return questions;
};
