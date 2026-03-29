import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('title, slug, excerpt, published_at, created_at')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    return new NextResponse('Error fetching posts', { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whimsicalwrites.com';

  const itemsXml = (posts || [])
    .map(post => {
      const url = `${siteUrl}/posts/${post.slug}`;
      const date = new Date(post.published_at || post.created_at).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>WhimsicalWrites</title>
    <link>${siteUrl}</link>
    <description>A curated, multi-niche publication exploring the intersections of careers, tech tools, personal finance, and building businesses.</description>
    <language>en</language>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
