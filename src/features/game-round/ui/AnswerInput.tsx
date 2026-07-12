import React, { useState } from 'react';


interface AnswerInputProps {
  difficulty: 'standard' | 'hardcore';
  options: string[]; // 4 варіанти назв
  onSubmitAnswer: (answer: string) => void;
  suggestionsPool?: string[]; // список назв для автодоповнення в хардкорі
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  difficulty,
  options,
  onSubmitAnswer,
  suggestionsPool = [],
}) => {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Обробка зміни тексту в інпуті для автодоповнення
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedAnswer(val);

    if (val.trim().length > 1) {
      const filtered = suggestionsPool
        .filter((name) => name.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setTypedAnswer(name);
    setSuggestions([]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedAnswer.trim()) {
      onSubmitAnswer(typedAnswer);
      setTypedAnswer('');
      setSuggestions([]);
    }
  };

  // Режим 1: Вибір із 4 кнопок (Стандарт)
  if (difficulty === 'standard') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full max-w-lg mx-auto mt-6">
        {options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            className="inline-flex shrink-0 items-center justify-center border border-border/80 bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-14 rounded-2xl font-semibold text-sm hover:border-secondary hover:shadow-neon-secondary/20 text-center px-4 cursor-pointer"
            onClick={() => onSubmitAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  // Режим 2: Ручне введення (Хардкор)
  return (
    <div className="w-full max-w-lg mx-auto mt-6 relative">
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Введіть оригінальну чи укр. назву..."
          value={typedAnswer}
          onChange={handleInputChange}
          className="h-14 flex-1 rounded-2xl border border-input bg-background/60 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center border border-transparent transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-14 px-6 rounded-2xl bg-primary hover:bg-primary/80 text-white font-bold cursor-pointer"
        >
          Відповісти
        </button>
      </form>

      {/* Список автодоповнення */}
      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 bottom-full mb-2 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
          {suggestions.map((name, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full text-left p-3 hover:bg-muted font-medium text-sm transition-all duration-150 border-b border-border/40 last:border-0"
              onClick={() => handleSuggestionClick(name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};