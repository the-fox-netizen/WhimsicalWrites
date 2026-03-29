import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { getAllCategories } from '@/features/posts/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whimsicalwrites.com';

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, category, updated_at')
    .eq('published', true);

  const blogUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/${post.category}/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categories = await getAllCategories();
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryUrls,
    ...blogUrls,
  ];
}
