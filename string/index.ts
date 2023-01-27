export const crowdLevelDescription = (percent: number) => {
  if (percent < 20) return "Not busy";
  else if (percent < 40) return "Not too busy";
  else if (percent < 60) return "Busy";
  else if (percent < 80) return "Crowded";
  else if (percent >= 80) return "Very crowded";
};
