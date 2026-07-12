import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import type { GameMode, GameDifficulty } from "@/entities/game";

export function useSettings(){
      const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem("player_name") || "Кіноман",
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("tmdb_access_token") || "",
  );
  const [mode, setMode] = useState<GameMode>("mixed");
  const [difficulty, setDifficulty] = useState<GameDifficulty>("standard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("player_name", playerName);
  }, [playerName]);

  const handleSaveSettings = () => {
    localStorage.setItem("tmdb_access_token", token);
    setIsSettingsOpen(false);
  };

  const handleStartGame = () => {
    navigate("/game", { state: { playerName, mode, difficulty } });
  };

  return {
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
  }
}