import React, { useState, useEffect } from 'react';
import { getLeaderboard, getStats } from '@/shared/lib';
import type { LeaderboardEntry, PlayerStats } from '@/shared/lib';

export const LeaderboardTable: React.FC = () => {
  const [records, setRecords] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'stats'>('leaderboard');

  useEffect(() => {
    setRecords(getLeaderboard());
    setStats(getStats());
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border/60 rounded-3xl p-6 shadow-2xl">
      {/* Навігація вкладками */}
      <div className="flex bg-background p-1.5 rounded-2xl border border-border/60 mb-6">
        <button
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-card text-primary shadow-lg border border-border/40 text-glow-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('leaderboard')}
        >
          &#x1f3c6; Таблиця рекордів
        </button>
        <button
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'stats'
              ? 'bg-card text-secondary shadow-lg border border-border/40 text-glow-secondary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          &#x1f4ca; Моя статистика
        </button>
      </div>

      {activeTab === 'leaderboard' ? (
        <div className="overflow-x-auto">
          {records.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider text-left">
                  <th className="pb-3 pl-4">Місце</th>
                  <th className="pb-3">Гравець</th>
                  <th className="pb-3 text-center">Режим</th>
                  <th className="pb-3 text-center">Складність</th>
                  <th className="pb-3 pr-4 text-right">Очки</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {records.map((row, index) => (
                  <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 pl-4 font-bold text-muted-foreground">
                      {index === 0 ? '&#x1f947;' : index === 1 ? '&#x1f948;' : index === 2 ? '&#x1f949;' : `${index + 1}`}
                    </td>
                    <td className="py-4 font-semibold text-foreground">{row.playerName}</td>
                    <td className="py-4 text-center text-xs capitalize text-muted-foreground">{row.mode}</td>
                    <td className="py-4 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          row.difficulty === 'hardcore'
                            ? 'text-primary bg-primary/5 border-primary/20 text-glow-primary'
                            : 'text-secondary bg-secondary/5 border-secondary/20 text-glow-secondary'
                        }`}
                      >
                        {row.difficulty}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-black text-right text-accent text-glow-secondary">
                      {row.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Таблиця рекордів порожня. Будьте першим, хто встановить рекорд!
            </div>
          )}
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background border border-border/60 rounded-2xl p-4 text-center">
              <span className="text-xs text-muted-foreground block mb-1">Зіграно ігор</span>
              <span className="text-2xl font-black text-foreground">{stats.gamesPlayed}</span>
            </div>
            <div className="bg-background border border-border/60 rounded-2xl p-4 text-center">
              <span className="text-xs text-muted-foreground block mb-1">Найвищий бал</span>
              <span className="text-2xl font-black text-accent text-glow-primary">{stats.highestScore}</span>
            </div>
            <div className="bg-background border border-border/60 rounded-2xl p-4 text-center col-span-2">
              <span className="text-xs text-muted-foreground block mb-1">Відсоток правильних відповідей</span>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="text-3xl font-black text-secondary text-glow-secondary">
                  {stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0}%
                </span>
                <span className="text-xs text-muted-foreground">
                  ({stats.correctAnswers} / {stats.totalAnswers})
                </span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};