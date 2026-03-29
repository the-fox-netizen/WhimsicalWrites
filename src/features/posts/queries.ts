import { supabase } from '@/lib/supabase';
import { Post } from './types';

export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category')
    .eq('published', true)
    .contains('tags', [tag])
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
  return data || [];
}

export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('tags')
    .eq('published', true);

  if (error || !data) {
    console.error('Error fetching tags:', error);
    return [];
  }

  const tagSet = new Set<string>();
  data.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => tagSet.add(tag));
    }
  });
  
  return Array.from(tagSet);
}

export async function getPostsByCategory(category: string, limit?: number): Promise<Post[]> {
  let query = supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category')
    .eq('published', true)
    .eq('category', category)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
  return data || [];
}

export async function getFeaturedPostsByCategory(category: string, limit?: number): Promise<Post[]> {
  let query = supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category')
    .eq('published', true)
    .eq('category', category)
    .eq('featured', true)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching featured posts by category:', error);
    return [];
  }
  return data || [];
}

const POSTS_PER_PAGE = 6;

const SELECT_FIELDS = 'id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category';

export async function getCategoryLandingData(category: string, page: number = 1) {
  // ── 1. Guaranteed total count (separate query, never null) ──────────────
  const { count: totalCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)
    .eq('category', category);

  const total = totalCount ?? 0;
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  // ── 2. Paginated posts: featured=true first, then by views desc ─────────
  const from = (page - 1) * POSTS_PER_PAGE;
  const to   = from + POSTS_PER_PAGE - 1;

  const { data: gridData } = await supabase
    .from('posts')
    .select(SELECT_FIELDS)
    .eq('published', true)
    .eq('category', category)
    .order('featured', { ascending: false }) // pinned posts float to top
    .order('views',    { ascending: false }) // then by engagement
    .range(from, to);

  // ── 3. Resolve the "featured post" for the hero slot (page 1 only) ──────
  // The first item in the grid IS the featured/top post — pull it out so the
  // category page can render it prominently, and keep remaining as the grid.
  const allRows    = (gridData ?? []) as Post[];
  const featuredPost = page === 1 && allRows.length > 0 && allRows[0].featured
    ? allRows[0]
    : null;
  const recentPosts = featuredPost ? allRows.slice(1) : allRows;

  return {
    featuredPost,
    recentPosts,
    totalCount: total,
    currentPage: page,
    totalPages,
  };
}

export async function getRelatedPosts(category: string, currentSlug: string, limit: number = 3): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category')
    .eq('published', true)
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
  return data || [];
}

export async function getAllCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('category')
    .eq('published', true);

  if (error || !data) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const categorySet = new Set<string>();
  data.forEach((post) => {
    if (post.category && typeof post.category === 'string') {
      categorySet.add(post.category.toLowerCase().trim());
    }
  });
  
  return Array.from(categorySet);
}
