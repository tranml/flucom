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