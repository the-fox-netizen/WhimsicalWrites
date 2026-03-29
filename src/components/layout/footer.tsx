import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-neutral-950 text-white py-12 px-6 mt-auto border-t border-neutral-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <h2 className="font-heading font-black text-2xl tracking-tighter uppercase mb-4">
            Whimsicalwrites
          </h2>
          <p className="text-neutral-400 text-sm font-medium leading-relaxed mb-6">
            A multi-niche publication for careers, tech, finance, and building businesses.
          </p>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Whimsicalwrites.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-12 sm:gap-24">
          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-2">
              Categories
            </h3>
            <div className="flex flex-col gap-4">
              <Link href="/careers" className="text-sm font-bold uppercase tracking-widest hover:text-[#b0d12a] transition-colors">Careers</Link>
              <Link href="/tech" className="text-sm font-bold uppercase tracking-widest hover:text-[#b0d12a] transition-colors">Tech</Link>
              <Link href="/finance" className="text-sm font-bold uppercase tracking-widest hover:text-[#b0d12a] transition-colors">Finance</Link>
              <Link href="/business" className="text-sm font-bold uppercase tracking-widest hover:text-[#b0d12a] transition-colors">Business</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-2">
              Company
            </h3>
            <div className="flex flex-col gap-4">
              <Link href="/about" className="text-sm font-bold uppercase tracking-widest hover:text-[#b0d12a] transition-colors">About</Link>
              <Link href="/privacy" className="text-sm font-bold uppercase tracking-widest hover:text-[#b0d12a] transition-colors">Privacy</Link>
              <Link href="/posts" className="text-sm font-bold uppercase tracking-widest hover:text-[#b0d12a] transition-colors">Archive</Link>
              <a href="/feed.xml" className="text-sm font-bold uppercase tracking-widest hover:text-[#b0d12a] transition-colors">RSS</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
