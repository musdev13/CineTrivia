import type { GameMode, GameDifficulty } from "@/entities/game";
import { LeaderboardTable } from "@/features/leaderboard";
import { useSettings } from "../hooks/useSettings";


export const HomePage: React.FC = () => {
  const {
    playerName,
    setPlayerName,
    mode,
    setMode,
    difficulty,
    setDifficulty,
    token,
    setToken,
    handleStartGame,
    isSettingsOpen,
    setIsSettingsOpen,
    handleSaveSettings
  } = useSettings();

  return ( <>
        {/* Панель налаштування гри */}
        <section className="bg-card border border-border/60 rounded-3xl p-6 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-glow-secondary text-secondary">
            Налаштування гри
          </h2>

          {/* Ім'я */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold">
              Ваше ім'я:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background/50 h-12 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Режими гри */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold">
              Режим вікторини:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["mixed", "poster", "cast", "backdrop"] as GameMode[]).map(
                (m) => (
                  <button
                    key={m}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                      mode === m
                        ? "bg-primary/10 text-primary border-primary/40 text-glow-primary"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setMode(m)}
                  >
                    {m === "mixed" && "&#x1f3b2; Змішаний"}
                    {m === "poster" && "&#x1f5bc; Постер"}
                    {m === "cast" && "&#x1f3ad; Актори"}
                    {m === "backdrop" && "&#x1f4f8; Кадр"}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Складність */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold">
              Складність:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["standard", "hardcore"] as GameDifficulty[]).map((d) => (
                <button
                  key={d}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                    difficulty === d
                      ? "bg-secondary/10 text-secondary border-secondary/40 text-glow-secondary"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setDifficulty(d)}
                >
                  {d === "standard" && "⭐ Стандарт (4 варіанти)"}
                  {d === "hardcore" && "&#x1f525; Хардкор (введення)"}
                </button>
              ))}
            </div>
          </div>

          {/* Кнопка старту */}
          <button
            type="button"
            onClick={handleStartGame}
            disabled={!token && !import.meta.env.VITE_TMDB_ACCESS_TOKEN}
            className="inline-flex shrink-0 items-center justify-center border border-transparent transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-black text-base rounded-2xl text-white cursor-pointer"
          >
            Грати зараз
          </button>

          {/* Кнопка налаштувань токена */}
          <div className="text-center">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium underline"
            >
              {!token && !import.meta.env.VITE_TMDB_ACCESS_TOKEN
                ? "⚠️ Потрібно ввести TMDB токен"
                : "⚙️ Редагувати токен TMDB"}
            </button>
          </div>

          {/* Спливаючі налаштування токена */}
          {isSettingsOpen && (
            <div className="p-4 bg-background border border-border/80 rounded-2xl space-y-4">
              <span className="text-xs text-glow-primary text-primary font-bold block">
                Налаштування TMDB API
              </span>
              <p className="text-[10px] text-muted-foreground">
                Введіть ваш v4 Read Access Token з особистого кабінету TMDB
                (developer.themoviedb.org).
              </p>
              <input
                type="password"
                placeholder="Введіть Bearer Token..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-xl border border-input bg-background h-10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <button
                type="button"
                onClick={handleSaveSettings}
                className="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 gap-1.5 px-2.5 w-full bg-muted border border-border hover:bg-muted/80 text-foreground cursor-pointer"
              >
                Зберегти зміни
              </button>
            </div>
          )}
        </section>

        {/* Таблиця рекордів */}
        <section className="w-full">
          <LeaderboardTable />
        </section>
        </>
  );
};
