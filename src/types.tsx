export type Media = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  url: string;
  lessonSetId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  subtitles?: SubtitleEntry[];
};

export type LessonSet = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  courseId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

// Subtitle
export type SubtitleEntry = {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  phonetic: string;
  translation: string;
  speaker: string;
};

// Play Time Tracking
export type DailyPlayTime = {
  date: string; // YYYY-MM-DD format
  seconds: number;
};

export type PlayTimeData = {
  videoId: string;
  totalSeconds: number; // All-time total
  dailyPlayTimes: DailyPlayTime[]; // Array of daily play times
  lastUpdated: string; // ISO timestamp
};