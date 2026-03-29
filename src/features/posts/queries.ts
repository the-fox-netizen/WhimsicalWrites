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

export async function getCategoryLandingData(category: string) {
  const { data: featuredData } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category')
    .eq('published', true)
    .eq('category', category)
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1);

  const featuredPost = featuredData && featuredData.length > 0 ? featuredData[0] : null;

  let recentQuery = supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category')
    .eq('published', true)
    .eq('category', category)
    .order('published_at', { ascending: false });

  if (featuredPost) {
    recentQuery = recentQuery.neq('id', featuredPost.id);
  }
  
  const { data: recentData } = await recentQuery.limit(6);

  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)
    .eq('category', category);

  return {
    featuredPost: featuredPost as Post | null,
    recentPosts: (recentData || []) as Post[],
    totalCount: count || 0
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
