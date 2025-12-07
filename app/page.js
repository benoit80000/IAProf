"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import HomeScreen from "../components/HomeScreen";
import MissionsScreen from "../components/MissionsScreen";
import MiniGamesScreen from "../components/MiniGamesScreen";
import ProfileScreen from "../components/ProfileScreen";
import GameScreen from "../components/GameScreen";
import ChatOverlay from "../components/ChatOverlay";
import { generateDailyMissions } from "./data/missions";
import { getGameById } from "./data/games";

const INITIAL_PLAYER = {
  name: "Léo",
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  totalSessions: 0,
  missionsCompleted: 0,
  skillLevels: {}
};

export default function Page() {
  const [tab, setTab] = useState("home");
  const [player, setPlayer] = useState(INITIAL_PLAYER);
  const [missions] = useState(generateDailyMissions);
  const [currentGame, setCurrentGame] = useState(null);
  const [currentSkillLevel, setCurrentSkillLevel] = useState(1);
  const [showChat, setShowChat] = useState(false);

  const startGameFromMission = (mission) => {
    const game = getGameById(mission.gameId);
    if (!game) return;
    startGame(game, mission);
  };

  const startGame = (game, mission = null) => {
    const storedLevel = player.skillLevels[game.skill] || 1;
    setCurrentSkillLevel(storedLevel);
    setCurrentGame({ game, mission });
    setPlayer((p) => ({ ...p, totalSessions: p.totalSessions + 1 }));
    setTab(null);
  };

  const exitGame = () => {
    setCurrentGame(null);
    setTab("home");
  };

  const gainXp = (amount) => {
    setPlayer((prev) => {
      let xp = prev.xp + amount;
      let level = prev.level;
      let nextLevelXp = prev.nextLevelXp;
      while (xp >= nextLevelXp) {
        xp -= nextLevelXp;
        level += 1;
        nextLevelXp = Math.floor(nextLevelXp * 1.2);
      }
      return { ...prev, xp, level, nextLevelXp };
    });
  };

  const changeLevelForSkill = (delta) => {
    if (!currentGame) return;
    const skillId = currentGame.game.skill;
    setPlayer((prev) => {
      const current = prev.skillLevels[skillId] || 1;
      const newLevel = Math.max(1, Math.min(5, current + delta));
      return {
        ...prev,
        skillLevels: { ...prev.skillLevels, [skillId]: newLevel }
      };
    });
    setCurrentSkillLevel((lvl) => Math.max(1, Math.min(5, lvl + delta)));
  };

  let content;
  if (currentGame) {
    content = (
      <GameScreen
        game={currentGame.game}
        level={currentSkillLevel}
        onExit={exitGame}
        onGainXp={gainXp}
        onChangeLevel={changeLevelForSkill}
      />
    );
  } else if (tab === "home") {
    content = (
      <HomeScreen
        player={player}
        missions={missions}
        onStartMission={startGameFromMission}
        onStartGame={(g) => startGame(g)}
        onOpenChat={() => setShowChat(true)}
      />
    );
  } else if (tab === "missions") {
    content = (
      <MissionsScreen
        missions={missions}
        onStartMission={startGameFromMission}
      />
    );
  } else if (tab === "mini-games") {
    content = <MiniGamesScreen onStartGame={(g) => startGame(g)} />;
  } else if (tab === "profile") {
    content = <ProfileScreen player={player} />;
  }

  return (
    <div className="app-root">
      <div className="app-shell">{content}</div>
      <Navbar current={tab || "home"} onChange={setTab} />
      {showChat && <ChatOverlay onClose={() => setShowChat(false)} />}
    </div>
  );
}
