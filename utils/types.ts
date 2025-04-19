export type MangaItem = {
  id: number;
  title: string;
  author: string;
  images: string[];
  coverImage: string;
  rating: string;
  ratingCount?: string;
  latestChapter?: string;
  description?: string;
  status?: string;
  genres?: string[];
  chapters?: string;
};

export type ChapterItem = {
  id: number;
  mangaId: number;
  number: number;
  title: string;
  pages: number;
  date: string;
};