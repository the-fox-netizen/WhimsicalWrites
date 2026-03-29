import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryLandingData } from '@/features/posts/queries';
import { PostCard } from '@/components/blog/post-card';
import type { Metadata, ResolvingMetadata } from 'next';
import { Category } from '@/features/posts/types';

export const revalidate = 60;

const CATEGORIES: Record<string, { name: string, description: string, title: string, metaDescription: string }> = {
  careers: {
    name: 'Careers',
    description: 'Career advice, interview prep, and growth strategies.',
    title: 'Career Advice, Job Tips & Hiring Guides | WhimsicalWrites',
    metaDescription: 'Expert guides on career advancement, job interviews, and workplace success.'
  },
  tech: {
    name: 'Tech',
    description: 'Developer tools, software engineering, and industry news.',
    title: 'Tech News, Tools & Developer Guides | WhimsicalWrites',
    metaDescription: 'Stay updated with latest tech tools, software development guides, and tech industry news.'
  },
  finance: {
    name: 'Finance',
    description: 'Personal finance, scaling revenue, and wealth building.',
    title: 'Personal Finance, Salary & Money Tips | WhimsicalWrites',
    metaDescription: 'Actionable tips on salary negotiation, personal finance, and money management.'
  },
  business: {
    name: 'Business',
    description: 'Startups, entrepreneurship, and monetization strategies.',
    title: 'Business, Startups & Monetization | WhimsicalWrites',
    metaDescription: 'Insights for founders, startup ideas, and business monetization guides.'
  }
};

type Props = {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return [
    { category: 'careers' },
    { category: 'tech' },
    { category: 'finance' },
    { category: 'business' }
  ];
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const config = CATEGORIES[params.category];

  if (!config) {
    return { title: 'Category Not Found | WhimsicalWrites' };
  }

  return {
    title: config.title,
    description: config.metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whimsicalwrites.com'}/${params.category}`
    }
  };
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const config = CATEGORIES[params.category];

  if (!config) {
    return notFound();
  }

  const { featuredPost, recentPosts, totalCount } = await getCategoryLandingData(params.category);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whimsicalwrites.com';

  const breadcrumbListLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: config.name,
        item: `${siteUrl}/${params.category}`
      }
    ]
  };

  const collectionPageLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.metaDescription,
    url: `${siteUrl}/${params.category}`
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd) }} />
      
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-12 flex items-center gap-2">
          <Link href="/" className="hover:text-neutral-950 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-neutral-950">{config.name}</span>
        </nav>

        {/* Hero */}
        <header className="mb-20 pb-16 border-b border-neutral-200">
          <h1 className="text-6xl md:text-8xl font-black font-heading leading-none tracking-tighter uppercase text-neutral-950 mb-6">
            {config.name}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-xl md:text-3xl text-neutral-600 font-medium max-w-2xl">
              {config.description}
            </p>
            <div className="flex flex-col items-end">
              <span className="text-5xl font-black text-neutral-200 leading-none">{totalCount}</span>
              <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">Total Posts</span>
            </div>
          </div>
        </header>

        {totalCount === 0 ? (
          <div className="p-16 border border-neutral-200 text-center bg-neutral-50">
            <h3 className="text-2xl font-bold font-heading uppercase text-neutral-400">No entries yet</h3>
            <p className="text-neutral-500 mt-2 font-medium">We are currently curating content for {config.name}. Check back soon.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {/* Featured Post */}
            {featuredPost && (
              <section>
                <h2 className="text-lg font-black uppercase tracking-widest text-neutral-950 mb-8 flex items-center gap-4">
                  <span className="w-4 h-4 rounded-full bg-[#b0d12a]" /> Featured
                </h2>
                <PostCard post={featuredPost} index={0} />
              </section>
            )}

            {/* Recent Posts Grid */}
            {recentPosts.length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase tracking-widest text-neutral-950 mb-8 border-b border-neutral-200 pb-4">
                  Latest in {config.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentPosts.map((post) => (
                    <PostCard key={post.id} post={post} index={1} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
