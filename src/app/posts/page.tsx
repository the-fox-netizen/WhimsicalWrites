import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getPublishedPosts } from '@/features/posts/queries';
import { Post } from '@/features/posts/types';

export const revalidate = 60;



export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-neutral-950 pb-8">
          <div>
            <span className="text-sm font-bold tracking-widest uppercase text-neutral-500 mb-4 block">Archive</span>
            <h1 className="text-6xl md:text-8xl font-black font-heading uppercase tracking-tighter text-neutral-950">
              Articles
            </h1>
          </div>
          <p className="text-neutral-500 font-medium max-w-sm text-lg mt-6 md:mt-0">
            Carefully selected works on design, architecture, and creators around the globe.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="p-12 border border-neutral-200 text-center">
            <h3 className="text-2xl font-bold font-heading uppercase text-neutral-400">No entries found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts.map((post: Post) => (
              <Link key={post.id} href={`/posts/${post.slug}`} className="group flex flex-col h-full">
                
                {/* Structural Image Placeholder */}
                <div className="w-full aspect-[4/3] bg-neutral-100 border border-neutral-200 mb-6 flex items-center justify-center p-6 transition-colors group-hover:bg-[#eaf5b1] group-hover:border-neutral-950">
                    <span className="font-heading font-bold text-4xl text-neutral-300 group-hover:text-neutral-900 transition-colors uppercase text-center break-words max-w-full leading-none">
                      {post.title}
                    </span>
                </div>
                
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
                    <span>Journal</span>
                    <span>
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold font-heading uppercase leading-tight text-neutral-950 mb-4 group-hover:underline decoration-2 underline-offset-4">
                    {post.title}
                  </h2>
                  
                  <p className="text-neutral-600 line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest">Read Article</span>
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
