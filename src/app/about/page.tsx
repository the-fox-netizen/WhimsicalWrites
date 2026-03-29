import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About',
  description: 'About WhimsicalWrites',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto prose prose-neutral prose-headings:font-heading prose-headings:font-bold prose-headings:uppercase prose-a:underline-offset-4">
        <h1>About WhimsicalWrites</h1>
        
        <p className="lead text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed border-l-4 border-neutral-950 pl-6 mb-12">
          An editorial exploration of modern design, architecture thoughts, and whimsical engineering moments.
        </p>

        <p>Welcome to WhimsicalWrites. We believe that technology and design are not just functional, but profoundly expressive. This space is dedicated to unpacking the intersection between rigorous engineering, beautiful aesthetics, and the unexpected moments of whimsy that occur along the way.</p>

        <h2>Our Mission</h2>
        <p>To document the evolving landscape of web development and design. We strip away the noise and focus on what matters: crafting exceptional digital experiences that perform beautifully and delight users.</p>

        <h2>What We Cover</h2>
        <ul>
          <li><strong>Architecture & Design:</strong> Deep dives into modern styling frameworks, typography, component structures, and visual storytelling.</li>
          <li><strong>Engineering:</strong> Tutorials and essays on Next.js, React, Supabase, and performance optimization techniques.</li>
          <li><strong>Editorial Thoughts:</strong> Opinion pieces on the state of the web and where we are heading next.</li>
        </ul>

        <div className="mt-16 pt-8 border-t border-neutral-200">
          <p>Thank you for reading. We're excited to share this journey with you.</p>
        </div>
      </div>
    </div>
  );
}
