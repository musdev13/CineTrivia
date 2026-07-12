import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "@/shared/api";
import type { TMDBMovie } from "@/shared/api";
import { generateQuizSession } from "@/entities/game";
import type { QuizQuestion, GameDifficulty } from "@/entities/game";
import { GameCard, AnswerInput } from "@/features/game-round";
import { checkAnswer, saveScore } from "@/shared/lib";

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    playerName = "Гравець",
    mode = "mixed",
    difficulty = "standard",
  } = location.state || {};

  // Стан ігрового циклу
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameOver, setGameOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  // Лічильники для статистики
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  // Ref щоб auto-save запускався лише один раз
  const savedRef = useRef(false);

  // Завантажуємо пул фільмів (запит робить TanStack Query)
  const {
    data: moviesPool,
    isLoading,
    error,
  } = useQuery<TMDBMovie[]>({
    queryKey: ["movies-pool"],
    queryFn: async () => {
      const page1 = await fetchPopularMovies(1);
      const page2 = await fetchPopularMovies(2);
      const page3 = await fetchPopularMovies(3);
      const page4 = await fetchPopularMovies(4);
      const page5 = await fetchPopularMovies(5);
      return [...page1, ...page2, ...page3, ...page4, ...page5];
    },
    staleTime: Infinity,
  });

  // Генерація запитань після завантаження фільмів
  useEffect(() => {
    if (moviesPool && moviesPool.length > 0) {
      setIsGenerating(true);
      generateQuizSession(moviesPool, mode, 15)
        .then((session) => {
          setQuestions(session);
          setIsGenerating(false);
        })
        .catch(() => setIsGenerating(false));
    }
  }, [moviesPool, mode]);

  // Таймер зворотного відліку
  useEffect(() => {
    if (gameOver || isGenerating || isLoading || !questions.length) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, gameOver, isGenerating, isLoading, questions]);

  // Auto-save при завершенні гри (незалежно від того, яку кнопку натисне гравець)
  useEffect(() => {
    if (gameOver && !savedRef.current && !isGenerating) {
      savedRef.current = true;
      saveScore({
        playerName,
        score,
        mode,
        difficulty,
        correctAnswers,
        totalAnswers,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  // Обробка закінчення часу на запитання
  const handleTimeOut = () => {
    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) setGameOver(true);
      return nextLives;
    });
    setCombo(0);
    nextQuestion();
  };

  const nextQuestion = () => {
    setWrongAttempts(0);
    setTimeLeft(25);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  // Перевірка відповіді гравця
  const handleAnswerSubmit = (submittedText: string) => {
    const currentQ = questions[currentIndex];
    const isCorrect = checkAnswer(
      submittedText,
      currentQ.correctAnswer,
      currentQ.originalTitle,
    );

    // Завжди рахуємо загальну кількість спроб
    setTotalAnswers((prev) => prev + 1);

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      // Розрахунок балів: база 100 + комбо + бонус за швидкість
      const basePoints = 100;
      const comboBonus = combo * 25;
      const speedBonus = Math.round(timeLeft * 2);
      const multiplier = (difficulty as GameDifficulty) === "hardcore" ? 2 : 1;

      setScore(
        (prev) => prev + (basePoints + comboBonus + speedBonus) * multiplier,
      );
      setCombo((prev) => prev + 1);
      nextQuestion();
    } else {
      setCombo(0);
      setWrongAttempts((prev) => {
        const nextAttempts = prev + 1;
        if (
          nextAttempts >= 3 ||
          (difficulty as GameDifficulty) === "hardcore"
        ) {
          setLives((prevLives) => {
            const nextLives = prevLives - 1;
            if (nextLives <= 0) setGameOver(true);
            return nextLives;
          });
          nextQuestion();
        }
        return nextAttempts;
      });
    }
  };

  // Навігація на головну (збереження вже відбулось автоматично)
  const handleGoHome = () => navigate("/");

  // Завантаження даних / Генерація питань
  if (isLoading || isGenerating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-neon-primary/20" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          Завантаження пулу фільмів та генерація питань з TMDB...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6 space-y-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-xl font-bold text-destructive">
          Сталася помилка з'єднання з TMDB API
        </h2>
        <p className="text-xs text-muted-foreground max-w-md">
          Будь ласка, перевірте ваше інтернет-з'єднання або переконайтеся, що
          ваш Bearer Token правильний у налаштуваннях на головній сторінці.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground hover:bg-primary/80 h-8 gap-1.5 px-2.5 text-sm font-medium transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        >
          Повернутися до головного меню
        </button>
      </div>
    );
  }

  const activeQuestion = questions[currentIndex];

  // Екран завершення гри
  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background space-y-8">
        <section className="bg-card border border-border/80 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
          <div className="h-1.5 w-full bg-primary absolute top-0 left-0 rounded-t-3xl" />
          <h2 className="text-3xl font-black text-glow-primary text-primary uppercase">
            Кінець гри!
          </h2>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-bold">
              Набрані очки
            </span>
            <div className="text-5xl font-black text-accent text-glow-secondary">
              {score}
            </div>
          </div>

          <div className="bg-background border border-border rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs font-semibold text-muted-foreground">
            <div>
              Режим: <span className="text-foreground capitalize">{mode}</span>
            </div>
            <div>
              Складність:{" "}
              <span className="text-foreground capitalize">{difficulty}</span>
            </div>
            <div className="col-span-2 text-center">
              Правильних відповідей:{" "}
              <span className="text-secondary font-black text-glow-secondary">
                {correctAnswers} / {totalAnswers}
              </span>
              {totalAnswers > 0 && (
                <span className="text-muted-foreground ml-1">
                  ({Math.round((correctAnswers / totalAnswers) * 100)}%)
                </span>
              )}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground">
            ✅ Результат збережено автоматично
          </p>

          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex shrink-0 items-center justify-center border border-transparent transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full h-12 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl cursor-pointer"
          >
            До головного меню
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 max-w-4xl mx-auto">
      {/* Панель стану (Статистика) */}
      <header className="flex justify-between items-center bg-card border border-border/60 rounded-2xl px-6 py-4 shadow-lg w-full">
        {/* Життя */}
        <div className="flex items-center gap-1.5 text-base">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`transition-all duration-300 ${i < lives ? "text-rose-500 scale-100" : "text-muted/40 scale-90"}`}
            >
              ❤️
            </span>
          ))}
        </div>

        {/* Прогрес раундів */}
        <div className="text-xs font-bold text-muted-foreground">
          Питання:{" "}
          <span className="text-foreground">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Рахунок */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-muted-foreground font-bold uppercase">
            Очки
          </span>
          <span className="text-lg font-black text-accent text-glow-secondary">
            {score}
          </span>
        </div>
      </header>

      {/* Шкала таймера */}
      <div className="w-full bg-card h-1.5 rounded-full mt-4 overflow-hidden border border-border/40">
        <div
          className={`h-full transition-all duration-1000 rounded-full ${
            timeLeft < 8 ? "bg-destructive animate-pulse" : "bg-secondary"
          }`}
          style={{ width: `${(timeLeft / 25) * 100}%` }}
        />
      </div>

      {/* Головна ігрова картка */}
      <main className="my-8 flex-1 flex flex-col justify-center">
        {activeQuestion && (
          <GameCard
            question={activeQuestion}
            wrongAttemptsCount={wrongAttempts}
          />
        )}

        {/* Панель вибору відповідей */}
        {activeQuestion && (
          <AnswerInput
            difficulty={difficulty}
            options={activeQuestion.options}
            onSubmitAnswer={handleAnswerSubmit}
            suggestionsPool={moviesPool ? moviesPool.map((m) => m.title) : []}
          />
        )}
      </main>

      {/* Інформація про комбо-серію */}
      <footer className="text-center min-h-[40px] flex items-center justify-center">
        {combo > 1 && (
          <div className="bg-primary/5 border border-primary/20 text-primary text-glow-primary font-black text-xs px-4 py-2 rounded-full uppercase tracking-wider animate-bounce">
            &#x1f525; Серія відповідей: X{combo}! (+{combo * 25} очок)
          </div>
        )}
      </footer>
    </div>
  );
};
