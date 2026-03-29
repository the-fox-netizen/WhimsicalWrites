import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ViewTracker } from '@/components/blog/view-tracker';
import { getRelatedPosts } from '@/features/posts/queries';
import { PostCard } from '@/components/blog/post-card';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, cover_image, published, author_id, created_at, updated_at, views, read_time_minutes, tags, meta_title, meta_description, og_image, published_at, featured, category')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Whimsicalwrites'
    };
  }

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || `Read ${post.title} on Whimsicalwrites.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whimsicalwrites.com';
  const imagePath = post.og_image || post.cover_image;
  const ogImage = imagePath 
    ? (imagePath.startsWith('http') ? imagePath : `${siteUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`)
    : `${siteUrl}/og.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      authors: ['Whimsicalwrites Editorial'],
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/posts/${post.slug}`,
    },
  };
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    return notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whimsicalwrites.com';
  const imagePath = post.og_image || post.cover_image;
  const ogImage = imagePath 
    ? (imagePath.startsWith('http') ? imagePath : `${siteUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`)
    : `${siteUrl}/og.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: ogImage,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    articleSection: post.category || 'General',
    author: {
      '@type': 'Person',
      name: 'Whimsicalwrites Editorial',
    },
    url: `${siteUrl}/posts/${post.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Whimsicalwrites',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    }
  };

  const relatedPosts = await getRelatedPosts(post.category || 'general', post.slug, 3);
  const categoryKey = (post.category || 'general').toLowerCase();
  const categoryName = post.category ? String(post.category).charAt(0).toUpperCase() + String(post.category).slice(1) : 'General';
  
  const categoryColors: Record<string, string> = {
    careers: 'bg-green-100 text-green-900',
    tech: 'bg-blue-100 text-blue-900',
    finance: 'bg-amber-100 text-amber-900',
    business: 'bg-purple-100 text-purple-900',
    general: 'bg-neutral-100 text-neutral-900',
  };
  const badgeColor = categoryColors[categoryKey] || categoryColors.general;

  return (
    <article className="min-h-screen pt-32 pb-20 px-6 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker slug={post.slug} />
      <div className="max-w-4xl mx-auto">
        <nav className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-12 flex items-center gap-2">
          <Link href="/" className="hover:text-neutral-950 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${categoryKey}`} className="hover:text-neutral-950 transition-colors">{categoryName}</Link>
          <span>/</span>
          <span className="text-neutral-950 truncate max-w-[200px] md:max-w-md">{post.title}</span>
        </nav>
        
        <header className="mb-16 border-b border-neutral-950 pb-12">
          {post.cover_image && (
            <div className="relative w-full aspect-[21/9] mb-12 bg-neutral-100 overflow-hidden">
              <Image 
                src={post.cover_image} 
                alt={post.title} 
                fill 
                priority 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-8 flex-wrap">
            <Link href={`/${categoryKey}`} className={`${badgeColor} px-3 py-1 hover:opacity-80 transition-opacity`}>
              {categoryName}
            </Link>
            <span>
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              &bull; {post.read_time_minutes || 1} min read
            </span>
            <span className="flex items-center gap-1">
              &bull; {post.views || 0} views
            </span>
            {post.tags && post.tags.length > 0 && (
              <span className="flex items-center gap-2 ml-auto">
                {post.tags.map((tag: string) => (
                  <Link key={tag} href={`/tags/${tag}`} className="hover:text-neutral-950 transition-colors">
                    #{tag}
                  </Link>
                ))}
              </span>
            )}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black font-heading leading-[0.9] tracking-tighter uppercase text-neutral-950 mb-8">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed max-w-2xl border-l-4 border-neutral-950 pl-6">
              {post.excerpt}
            </p>
          )}
        </header>

        <div className="prose prose-lg prose-neutral prose-headings:font-heading prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tighter max-w-none prose-a:underline-offset-4 prose-a:decoration-2">
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black font-heading uppercase text-neutral-950 tracking-tighter">
                More in {categoryName}
              </h3>
              <Link href={`/${categoryKey}`} className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-950 transition-colors flex items-center gap-2">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost, i) => (
                <PostCard key={relatedPost.id} post={relatedPost} index={1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
