export type ViewType = 'domain' | 'tag';

export interface Bookmark {
  title: string;
  url: string;
  description: string;
  domain: string;
  favicon?: string;
  tags: string[];
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}
