import React from 'react';
import type { QuizQuestion } from '@/entities/game';
import { getImageUrl } from '@/shared/api';

interface GameCardProps {
  question: QuizQuestion;
  wrongAttemptsCount: number; // кількість помилок на поточному питанні
}

export const GameCard: React.FC<GameCardProps> = ({ question, wrongAttemptsCount }) => {
  const { type, movie, castNames, backdropPath } = question;

  // Визначення рівня розмиття для постера в залежності від помилок (робимо гру приємнішою та реалістичнішою)
  const getBlurClass = () => {
    if (wrongAttemptsCount === 0) return 'blur-md scale-102'; // 12px blur
    if (wrongAttemptsCount === 1) return 'blur-sm scale-101'; // 4px blur
    if (wrongAttemptsCount === 2) return 'blur-[1.5px]';      // дуже легке розмиття
    return 'blur-none'; // повністю чіткий
  };

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : null;

  return (
    <div className="relative w-full max-w-lg mx-auto bg-card border border-border/60 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Світлодіодна лінія зверху */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary animate-pulse" />

      <div className="p-6 flex flex-col items-center justify-center min-h-[380px]">
        {/* Режим 1: Вгадування за постером */}
        {type === 'poster' && (
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="relative w-64 h-96 rounded-2xl overflow-hidden border border-primary/30 bg-background/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]">
              {movie.poster_path ? (
                <img
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt="Постер фільму"
                  className={`w-full h-full object-cover select-none transition-all duration-700 ease-out ${getBlurClass()}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Постер відсутній
                </div>
              )}
              {/* Текстовий індикатор спроб */}
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-secondary text-glow-secondary select-none">
                Спроба: {wrongAttemptsCount + 1}/3
              </div>
            </div>

            {/* Підказка з роком виходу */}
            {releaseYear && (
              <div className="bg-muted/40 border border-border/50 rounded-xl px-4 py-1.5 text-xs text-muted-foreground font-semibold">
                &#x1f4c5; Рік виходу: <span className="text-foreground">{releaseYear}</span>
              </div>
            )}
          </div>
        )}

        {/* Режим 2: Вгадування за акторським складом */}
        {type === 'cast' && (
          <div className="w-full text-center space-y-5 py-4">
            <span className="text-glow-secondary font-bold text-xs uppercase tracking-widest text-secondary block">
              &#x1f3ad; Акторський склад фільму:
            </span>
            <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
              {castNames && castNames.length > 0 ? (
                castNames.map((name, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-3 bg-background/80 border border-border/80 rounded-2xl hover:border-secondary/40 hover:shadow-[0_0_10px_rgba(var(--secondary-rgb),0.1)] transition-all duration-200"
                  >
                    <span className="text-sm font-semibold text-foreground">{name}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">Актори не знайдені</div>
              )}
            </div>
            {releaseYear && (
              <div className="bg-muted/40 border border-border/50 rounded-xl px-4 py-1.5 text-xs text-muted-foreground font-semibold inline-block">
                &#x1f4c5; Рік виходу: <span className="text-foreground">{releaseYear}</span>
              </div>
            )}
          </div>
        )}

        {/* Режим 3: Вгадування за кадром */}
        {type === 'backdrop' && (
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-glow-primary font-bold text-xs uppercase tracking-widest text-primary">
                &#x1f4f8; Кадр з фільму:
              </span>
              {releaseYear && (
                <span className="text-xs text-muted-foreground font-semibold">
                  &#x1f4c5; Рік: {releaseYear}
                </span>
              )}
            </div>
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-primary/20 shadow-lg bg-background/50">
              {backdropPath ? (
                <img
                  src={getImageUrl(backdropPath, 'w780')}
                  alt="Кадр з фільму"
                  className="w-full h-full object-cover select-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Кадр відсутній
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};