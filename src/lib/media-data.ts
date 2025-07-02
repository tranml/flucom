import { Media, LessonSet, Course } from "../types";
import path from "path";

import { subtitle2, subtitle3 } from "./subtitle-data";

export const media: Media[] = [
  {
    id: "1",
    title: "Bubba's Food Audio",
    slug: "bubbas-food-audio",
    url: "https://res.cloudinary.com/dqssqzt3y/video/upload/v1751030255/Bubbas_Food_Audio_awhs6z.mp3",
    lessonSetId: "1",
    order: 1,
    createdAt: "2025-06-29T00:00:00.000Z",
    updatedAt: "2025-06-29T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Hidden Y Sounds (Part 4 of 4)",
    slug: "hidden-y-sounds-part-4-of-4",
    url: "https://res.cloudinary.com/dqssqzt3y/video/upload/v1750664615/unit-4--part-4-of-4_aowxmp.mp4",
    lessonSetId: "2",
    order: 4,
    createdAt: "2025-06-29T00:00:00.000Z",
    updatedAt: "2025-06-29T00:00:00.000Z",
    subtitles: subtitle2,
  },
  {
    id: "3",
    title: "Hidden Y Sounds (Part 1 of 4)",
    slug: "hidden-y-sounds-part-1-of-4",
    url: "https://res.cloudinary.com/dqssqzt3y/video/upload/v1749436156/unit-4--part-1-of-3_npievd.mp4",
    lessonSetId: "2",
    order: 1,
    createdAt: "2025-06-29T00:00:00.000Z",
    updatedAt: "2025-06-29T00:00:00.000Z",
    subtitles: subtitle3,
  },
];


export const lessonSets: LessonSet[] = [
  {
    id: "1",
    title: "Lesson 3: Bubba's Food",
    slug: "lesson-3-bubbas-food",
    courseId: "1",
    order: 1,
    createdAt: "2025-06-29T00:00:00.000Z",
    updatedAt: "2025-06-29T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Unit 4: Hidden Y Sounds",
    slug: "unit-4-hidden-y-sounds",
    courseId: "2",
    order: 1,
    createdAt: "2025-06-29T00:00:00.000Z",
    updatedAt: "2025-06-29T00:00:00.000Z",
  },
];

export const courses: Course[] = [
  {
    id: "1",
    title: "Original English",
    subtitle: "Fluency & Confidence Training",
    slug: "original-english",
    order: 1,
    createdAt: "2025-06-29T00:00:00.000Z",
    updatedAt: "2025-06-29T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Miracle Pronunciation Academy",
    subtitle: "Fix Your English Pronunciation",
    slug: "miracle-pronunciation-academy",
    order: 2,
    createdAt: "2025-06-29T00:00:00.000Z",
    updatedAt: "2025-06-29T00:00:00.000Z",
  },
  {
    id: "3",
    title: "This American Life",
    subtitle: "Speak English like a Native",
    slug: "this-american-life",
    order: 3,
    createdAt: "2025-06-29T00:00:00.000Z",
    updatedAt: "2025-06-29T00:00:00.000Z",
  },
];

export const getCourseTitle = (courseId: string) => {
  return courses.find((course) => course.id === courseId)?.title;
};

export const getLessonSetTitle = (lessonSetId: string) => {
  return lessonSets.find((lessonSet) => lessonSet.id === lessonSetId)?.title;
};

export const getCourseTitleFromMedia = (media: Media) => {
  const lessonSet = lessonSets.find((ls) => ls.id === media.lessonSetId);
  if (!lessonSet) return undefined;

  return courses.find((course) => course.id === lessonSet.courseId)?.title;
};

export const getMediaType = (media: Media) => {
  const videoExtensions = [".mp4"];

  return videoExtensions.includes(path.extname(media.url)) ? "video" : "audio";
};
