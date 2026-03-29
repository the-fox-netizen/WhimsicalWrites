'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Post } from '@/features/posts/types';

interface PostCardProps {
  post: Post;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const isFeatured = index === 0;
  const router = useRouter();

  const categoryColors: Record<string, string> = {
    careers: 'bg-green-100 text-green-900',
    tech: 'bg-blue-100 text-blue-900',
    finance: 'bg-amber-100 text-amber-900',
    business: 'bg-purple-100 text-purple-900',
    general: 'bg-neutral-100 text-neutral-900',
  };
  const categoryKey = (post.category || 'general').toLowerCase();
  const badgeColor = categoryColors[categoryKey] || categoryColors.general;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.1 }}
      className={`group flex flex-col h-full bg-white border border-neutral-200 overflow-hidden hover:border-neutral-950 transition-colors ${isFeatured ? 'lg:col-span-2 lg:flex-row' : ''}`}
    >
      <Link href={`/posts/${post.slug}`} className="flex flex-col lg:flex-row w-full h-full">
        <div className={`relative w-full bg-neutral-50 flex items-center justify-center p-8 transition-colors group-hover:bg-[#eaf5b1] overflow-hidden border-b lg:border-b-0 ${isFeatured ? 'lg:border-r border-neutral-200 lg:w-1/2 min-h-[400px]' : 'aspect-square lg:aspect-[4/3]'}`}>
          {post.cover_image ? (
            <Image 
              src={post.cover_image} 
              alt={post.title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
              sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <span className={`z-10 relative font-heading font-black text-neutral-300 group-hover:text-neutral-900 transition-colors uppercase text-center break-words max-w-full leading-none ${isFeatured ? 'text-5xl md:text-7xl' : 'text-3xl'}`}>
              {post.title}
            </span>
          )}
        </div>
        
        <div className={`flex flex-col flex-1 p-8 ${isFeatured ? 'lg:w-1/2' : ''}`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6">
            <span 
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/${categoryKey}`);
              }} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/${categoryKey}`);
                }
              }}
              className={`${badgeColor} px-3 py-1 hover:opacity-80 transition-opacity cursor-pointer relative z-10`}
            >
              {post.category || 'General'}
            </span>
            <span>
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          
          <h2 className={`font-bold font-heading uppercase leading-[1.1] text-neutral-950 mb-6 group-hover:underline decoration-4 underline-offset-4 ${isFeatured ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
            {post.title}
          </h2>
          
          <p className={`text-neutral-600 mb-8 font-medium ${isFeatured ? 'text-lg line-clamp-4' : 'line-clamp-3'}`}>
            {post.excerpt}
          </p>
          
          <div className="mt-auto pt-8 border-t border-neutral-200 flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-950 group-hover:bg-[#b0d12a] transition-colors" />
              Read Article
            </span>
            <motion.div 
              whileHover={{ rotate: 45 }}
              className="p-3 bg-neutral-950 text-white rounded-full group-hover:bg-[#b0d12a] group-hover:text-neutral-950 transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
