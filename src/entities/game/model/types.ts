import { TMDBMovie } from "@/shared/api";

export type GameMode = "poster" | "cast" | "backdrop" | "mixed";
export type GameDifficulty = "standard" | "hardcore";

export interface QuizQuestion {
    id: string; // унікальний ID запитання
    movie: TMDBMovie; // правильний фільм
    type: "poster" | "cast" | "backdrop"; // тип підказки для цього раунду
    options: string[]; // 4 назви фільмів (для стандартного режиму)
    castNames?: string[]; // список імен акторів (для режиму "cast")
    backdropPath?: string; // шлях до кадру (для режиму "backdrop")
    correctAnswer: string; // назва правильної відповіді (українською)
    originalTitle: string; // оригінальна назва (англійською)
}

export interface GameSessionState {
    isActive: boolean;
    playerName: string;
    score: number;
    multiplier: number; // множник очок за комбо правильних відповідей
    comboCount: number; // лічильник серії правильних відповідей
    lives: number; // кількість життів (зазвичай 3)
    questions: QuizQuestion[];
    currentQuestionIndex: number;
    mode: GameMode;
    difficulty: GameDifficulty;
    timeLeft: number; // час на відповідь (в секундах)
}
