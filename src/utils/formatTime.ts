export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Format play time for display
export const formatPlayTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// Format play time summary for media list display
export const formatPlayTimeSummary = (totalSeconds: number, todaySeconds: number): string => {
  const total = formatPlayTime(totalSeconds);
  const today = formatPlayTime(todaySeconds);
  
  if (todaySeconds > 0) {
    return `${total} (Today: ${today})`;
  } else {
    return total;
  }
};