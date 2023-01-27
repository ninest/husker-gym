export const crowdLevelDescription = (percent: number) => {
  if (percent < 20) return "not busy";
  else if (percent < 40) return "not too busy";
  else if (percent < 60) return "busy";
  else if (percent < 80) return "crowded";
  else if (percent >= 80) return "very crowded";
};
