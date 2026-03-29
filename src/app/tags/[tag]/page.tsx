import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/post-list';
import { getPostsByTag, getAllTags } from '@/features/posts/queries';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 60;

type Props = {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag,
  }));
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const decodedTag = decodeURIComponent(params.tag);

  return {
    title: `Posts tagged #${decodedTag}`,
    description: `Read all posts tagged #${decodedTag} on Whimsicalwrites.`,
  };
}

export default async function TagPage(props: Props) {
  const params = await props.params;
  const decodedTag = decodeURIComponent(params.tag);
  const posts = await getPostsByTag(decodedTag);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-b border-neutral-950 pb-12">
          <h1 className="text-5xl md:text-7xl font-black font-heading leading-[0.9] tracking-tighter uppercase text-neutral-950 mb-8">
            <span className="text-neutral-300">#</span>{decodedTag}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed max-w-2xl border-l-4 border-neutral-950 pl-6">
            Exploring stories, essays, and journals tagged with {decodedTag}.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="p-12 border border-neutral-200 text-center mt-20">
            <h3 className="text-2xl font-bold font-heading uppercase text-neutral-400">No posts found</h3>
            <p className="text-neutral-500 mt-2">There are no entries with this tag yet.</p>
          </div>
        ) : (
          <PostList initialPosts={posts} />
        )}
      </div>
    </div>
  );
}
