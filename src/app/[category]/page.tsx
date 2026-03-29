import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryLandingData, getAllCategories } from '@/features/posts/queries';
import { PostCard } from '@/components/blog/post-card';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 60;

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

function getCategoryMeta(categorySlug: string) {
  const name = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
  return {
    name,
    description: `Browse all articles, insights and resources related to ${name}.`,
    title: `${name} | WhimsicalWrites`,
    metaDescription: `Discover the latest posts and articles in the ${name} category on WhimsicalWrites.`,
  };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ category: cat }));
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const config = getCategoryMeta(params.category);
  return {
    title: config.title,
    description: config.metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whimsicalwrites.com'}/${params.category}`,
    },
  };
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const config = getCategoryMeta(params.category);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whimsicalwrites.com';

  const currentPage = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const { featuredPost, recentPosts, totalCount, totalPages } =
    await getCategoryLandingData(params.category, currentPage);

  if (totalCount === 0) {
    return notFound();
  }

  const breadcrumbListLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: config.name, item: `${siteUrl}/${params.category}` },
    ],
  };

  const collectionPageLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.metaDescription,
    url: `${siteUrl}/${params.category}`,
  };

  // Build page number array for pagination
  const pageNumbers: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push('...');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) pageNumbers.push(i);
    if (currentPage < totalPages - 2) pageNumbers.push('...');
    pageNumbers.push(totalPages);
  }

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

        {/* Hero header */}
        <header className="mb-20 pb-16 border-b border-neutral-200">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black font-heading leading-none tracking-tighter uppercase text-neutral-950 mb-6 break-words">
            {config.name}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-lg sm:text-xl md:text-3xl text-neutral-600 font-medium max-w-2xl">
              {config.description}
            </p>
            <div className="flex flex-col items-end">
              <span className="text-5xl font-black text-neutral-200 leading-none">{totalCount}</span>
              <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">Total Posts</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-16">
          {/* Featured post — page 1 only */}
          {currentPage === 1 && featuredPost && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-widest text-neutral-950 mb-8 flex items-center gap-4">
                <span className="w-4 h-4 rounded-full bg-[#b0d12a]" /> Featured
              </h2>
              <PostCard post={featuredPost} index={0} />
            </section>
          )}

          {/* Paginated grid */}
          {recentPosts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8 border-b border-neutral-200 pb-4">
                <h2 className="text-lg font-black uppercase tracking-widest text-neutral-950">
                  {currentPage === 1 ? `Top Posts in ${config.name}` : `More in ${config.name}`}
                </h2>
                {totalCount > 0 && (
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} index={1} />
                ))}
              </div>
            </section>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-8 border-t border-neutral-200">
              {/* Prev */}
              {currentPage > 1 ? (
                <Link
                  href={`/${params.category}?page=${currentPage - 1}`}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-widest border border-neutral-300 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white transition-colors"
                >
                  ← Prev
                </Link>
              ) : (
                <span className="px-4 py-2 text-sm font-bold uppercase tracking-widest border border-neutral-100 text-neutral-300 cursor-not-allowed">
                  ← Prev
                </span>
              )}

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-3 py-2 text-neutral-400 text-sm font-bold">
                      …
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={`/${params.category}?page=${p}`}
                      className={`w-10 h-10 flex items-center justify-center text-sm font-black uppercase tracking-widest border transition-colors ${
                        p === currentPage
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'border-neutral-200 hover:border-neutral-950 hover:bg-neutral-50'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
              </div>

              {/* Next */}
              {currentPage < totalPages ? (
                <Link
                  href={`/${params.category}?page=${currentPage + 1}`}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-widest border border-neutral-300 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white transition-colors"
                >
                  Next →
                </Link>
              ) : (
                <span className="px-4 py-2 text-sm font-bold uppercase tracking-widest border border-neutral-100 text-neutral-300 cursor-not-allowed">
                  Next →
                </span>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
