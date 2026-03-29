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
        <div className="mb-12 w-full max-w-[400px] h-[80px] relative">
          <Image 
            src="/transparentnormal.png" 
            alt="WhimsicalWrites Logo" 
            fill
            className="object-contain object-left"
          />
        </div>
        <h1>About WhimsicalWrites</h1>
        
        <p className="lead text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed border-l-4 border-neutral-950 pl-6 mb-12">
          A curated, multi-niche publication exploring the intersections of careers, tech tools, personal finance, and building businesses.
        </p>

        <p>Welcome to WhimsicalWrites. We believe that building a successful life and career requires a holistic approach. This space is dedicated to unpacking the strategies, tools, and insights that help you grow professionally and personally, with a touch of whimsy along the way.</p>

        <h2>Our Mission</h2>
        <p>To provide actionable, high-quality insights across multiple disciplines. We strip away the noise and focus on what matters: empowering our readers to make informed decisions about their careers, finances, and entrepreneurial journeys.</p>

        <h2>What We Cover</h2>
        <ul>
          <li><strong>Careers:</strong> Actionable advice on navigating the modern workplace, developing valuable skills, and accelerating your professional growth.</li>
          <li><strong>Tech:</strong> Deep dives into the latest software, tools, and methodologies shaping the future of work and web development.</li>
          <li><strong>Finance:</strong> Insights on personal finance, investment strategies, and building long-term wealth.</li>
          <li><strong>Business:</strong> Stories and lessons on entrepreneurship, from launching startups to scaling businesses.</li>
        </ul>

        <div className="mt-16 pt-8 border-t border-neutral-200">
          <p>Thank you for reading. We're excited to share this journey with you.</p>
        </div>
      </div>
    </div>
  );
}
