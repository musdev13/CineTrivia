export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  mode: "poster" | "cast" | "backdrop" | "mixed";
  difficulty: "standard" | "hardcore";
  date: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  totalScore: number;
  highestScore: number;
  correctAnswers: number;
  totalAnswers: number;
}

const LEADERBOARD_KEY = "cinetrivia_leaderboard";
const STATS_KEY = "cinetrivia_stats";

// Збереження нового результату в таблицю лідерів
export const saveScore = (
  entry: Omit<LeaderboardEntry, "id" | "date"> & {
    correctAnswers?: number;
    totalAnswers?: number;
  },
): LeaderboardEntry => {
  const leaderboard = getLeaderboard();

  const newEntry: LeaderboardEntry = {
    ...entry,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  leaderboard.push(newEntry);
  // Сортуємо за спаданням балів та залишаємо топ-50
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem(
    LEADERBOARD_KEY,
    JSON.stringify(leaderboard.slice(0, 50)),
  );

  // Оновлюємо загальну статистику
  updateGlobalStats(entry.score, true);

  return newEntry;
};

// Отримання списку рекордів
export const getLeaderboard = (): LeaderboardEntry[] => {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  return data ? JSON.parse(data) : [];
};

// Отримання загальної статистики
export const getStats = (): PlayerStats => {
  const data = localStorage.getItem(STATS_KEY);
  return data
    ? JSON.parse(data)
    : {
        gamesPlayed: 0,
        totalScore: 0,
        highestScore: 0,
        correctAnswers: 0,
        totalAnswers: 0,
      };
};

// Оновлення глобальної статистики після кожної гри чи раунду
export const updateGlobalStats = (
  score: number,
  isGameEnd = false,
  correctCount = 0,
  totalAnswersCount = 0,
) => {
  const stats = getStats();

  if (isGameEnd) {
    stats.gamesPlayed += 1;
    stats.totalScore += score;
    if (score > stats.highestScore) {
      stats.highestScore = score;
    }
  }

  stats.correctAnswers += correctCount;
  stats.totalAnswers += totalAnswersCount;

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};