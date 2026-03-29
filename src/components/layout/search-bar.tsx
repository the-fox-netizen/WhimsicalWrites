'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = Array.from(new Set(posts.map(p => p.category))).filter(Boolean);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('posts')
        .select('id, title, excerpt, slug, category, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });
      if (data) {
        setPosts(data);
        setFilteredPosts(data);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = [...posts];

    if (query.trim() !== '') {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(lowercaseQuery))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (selectedSort === 'newest') {
      result.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    } else if (selectedSort === 'oldest') {
      result.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
    }

    setFilteredPosts(result);
  }, [query, posts, selectedCategory, selectedSort]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="relative flex-1 sm:flex-none">
      {!isOpen ? (
        <div
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 border-[1.5px] border-[#756226] rounded-[20px] bg-white transition-all cursor-text w-[120px] min-[400px]:w-[150px] sm:w-[250px] group hover:border-[#96813f]"
        >
          <Search className="w-4 h-4 text-[#756226]" />
          <span className="text-sm text-neutral-400 select-none">Search...</span>
        </div>
      ) : (
        <div className="fixed inset-0 z-[100] w-full h-full bg-white flex flex-col items-center">
          <div className="w-full pt-8 sm:pt-12 md:pt-16 lg:pt-16 flex flex-col h-full gap-6 md:gap-8">
            <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 relative mx-auto w-full max-w-6xl px-4 lg:px-8">
              <div className="flex gap-2 w-full lg:flex-1 items-center">
                <div className="flex-1 flex items-center gap-2 md:gap-3 border-[1.5px] border-[#756226] rounded-full bg-white px-4 py-2.5 md:py-3 w-full">
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-[#756226] shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type to search blogs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-black text-base md:text-xl font-medium placeholder:text-neutral-400 focus:outline-none w-full"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                    setSelectedCategory('all');
                    setSelectedSort('newest');
                  }}
                  className="lg:hidden p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-full shrink-0 cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-neutral-600 hover:text-black" />
                </button>
              </div>

              <div className="flex flex-row items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 md:px-4 md:py-3 border-[1.5px] border-[#756226] rounded-full bg-white text-[#756226] font-bold text-xs md:text-sm uppercase tracking-widest focus:outline-none cursor-pointer shrink-0"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select 
                  value={selectedSort} 
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="px-3 py-2 md:px-4 md:py-3 border-[1.5px] border-[#756226] rounded-full bg-white text-[#756226] font-bold text-xs md:text-sm uppercase tracking-widest focus:outline-none cursor-pointer shrink-0"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                    setSelectedCategory('all');
                    setSelectedSort('newest');
                  }}
                  className="hidden lg:block p-3 bg-neutral-100 hover:bg-neutral-200 rounded-full shrink-0 cursor-pointer ml-2"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6 text-neutral-600 hover:text-black" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto w-full pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#756226] mb-6">
                  {query.trim() === '' ? 'Recommended Blogs' : 'Search Results'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${post.category}/${post.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="flex flex-col h-full gap-4 p-6 border border-[#756226] rounded-xl bg-white hover:bg-neutral-50 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-500 group-hover:text-[#756226] transition-colors">
                        {post.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-heading font-black uppercase tracking-tighter text-black leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-neutral-500 text-sm line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center text-neutral-500 py-20 font-medium text-lg border border-dashed border-neutral-300 rounded-xl">
                    No blogs found matching "{query}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
