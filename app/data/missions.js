export function generateDailyMissions() {
  const today = new Date().toDateString();
  return {
    date: today,
    missions: [
      {
        id: "mission-francais-1",
        title: "Les adjectifs et les natures de mots",
        description: "Travaille ton sens de la phrase.",
        gameId: "nature-fonction",
        xpReward: 10
      },
      {
        id: "mission-maths-1",
        title: "Tables de multiplication",
        description: "Deviens plus rapide sur tes tables.",
        gameId: "defi-tables",
        xpReward: 10
      },
      {
        id: "mission-logique-1",
        title: "Observation et suites logiques",
        description: "Entraîne ton cerveau à repérer les suites et les intrus.",
        gameId: "suites-logiques",
        xpReward: 8
      }
    ]
  };
}
