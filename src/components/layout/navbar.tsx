'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' }
  ];

  return (
    <nav className="w-full bg-white border-b border-neutral-200 relative z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading font-black text-2xl tracking-tighter uppercase text-neutral-950">
              Whimsicalwrites
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="text-sm font-semibold uppercase tracking-wider bg-neutral-950 text-white px-5 py-2.5 hover:bg-neutral-800 transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button — simple swap avoids SSR hydration mismatch */}
          <button
            className="md:hidden p-2 text-neutral-950"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav — transition via max-height/opacity */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        } absolute top-20 left-0 w-full bg-white border-b border-neutral-200 shadow-xl z-40`}
      >
        <div className="flex flex-col gap-4 px-4 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors py-2 border-b border-neutral-100"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-sm font-semibold uppercase tracking-wider bg-neutral-950 text-white px-5 py-2.5 hover:bg-neutral-800 transition-colors text-center mt-2"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
