
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  views: number;
  read_time_minutes: number;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  published_at: string | null;
  featured: boolean;
  category: string;
}
