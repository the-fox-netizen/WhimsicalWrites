import { getPostsByCategory, getAllCategories } from '@/features/posts/queries';
import { PostCard } from '@/components/blog/post-card';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export const metadata = {
  title: 'WhimsicalWrites — Careers, Tech, Finance & Business',
  description: 'A confident, clean, and multi-niche publication covering insights on careers, tech tools, personal finance, and building businesses.',
};



export default async function MarketingPage() {
  const categories = await getAllCategories();

  const categoryPosts = await Promise.all(
    categories.map(async (cat) => {
      const posts = await getPostsByCategory(cat, 3);
      const name = cat.charAt(0).toUpperCase() + cat.slice(1);
      return { 
        id: cat, 
        name, 
        description: `Explore our latest articles in ${name}`, 
        link: `/${cat}`, 
        posts 
      };
    })
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whimsicalwrites.com';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WhimsicalWrites',
    url: siteUrl,
    description: metadata.description
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 border-b border-neutral-200 bg-neutral-50 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-6 w-full max-w-[600px] h-[100px] md:h-[200px] relative">
            <Image 
              src="/transparentnormal.png" 
              alt="WhimsicalWrites" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="sr-only">
            WhimsicalWrites
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed max-w-2xl px-2">
            A curated publication exploring the intersections of careers, tech, finance, and business.
          </p>
        </div>
      </section>

      {/* Category Sections */}
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col gap-32">
        {categoryPosts.map((category) => {
          if (!category.posts || category.posts.length === 0) return null;

          return (
            <section key={category.id} className="flex flex-col gap-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
                <div>
                  <Link href={category.link} className="inline-block group">
                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase text-neutral-950 group-hover:underline decoration-4 underline-offset-4">
                      {category.name}
                    </h2>
                  </Link>
                  <p className="text-neutral-500 font-medium mt-2 text-lg">
                    {category.description}
                  </p>
                </div>
                <Link 
                  href={category.link}
                  className="text-sm font-black uppercase tracking-widest text-neutral-950 hover:text-[#b0d12a] transition-colors whitespace-nowrap"
                >
                  View all {category.name} &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {category.posts.map((post) => (
                  <PostCard key={post.id} post={post} index={1} /> 
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
