import type { PostRow, ProjectRow } from './schema';

export type Project = ProjectRow & {
  techTagsList: string[];
};

export type Post = PostRow & {
  tagList: string[];
};

export type TagCount = {
  tag: string;
  count: number;
};
