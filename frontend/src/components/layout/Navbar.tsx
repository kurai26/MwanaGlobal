'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const navLinks = [
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'About', href: '/about' },
  {
    label: 'For Institutions',
    href: '#',
    children: [
      { label: 'Universities', href: '/institutions/universities' },
      { label: 'Scouts', href: '/institutions/scouts' },
    ],
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = isHome
    ? scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    : 'bg-white shadow-sm';

  const textColor = isHome && !scrolled ? 'text-white' : 'text-gray-700';
  const logoColor = isHome && !scrolled ? 'text-white' : 'text-brand-blue';

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', navBg)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-blue rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-brand-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={cn('font-display font-bold text-lg leading-tight', logoColor)}>
                Mwana
              </span>
              <span className={cn('font-display font-bold text-lg leading-tight', isHome && !scrolled ? 'text-brand-gold' : 'text-brand-gold')}>
                Global
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <button className={cn('flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors', textColor, 'hover:text-brand-blue hover:bg-brand-blue/5')}>
                    {link.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {link.children.map(child => (
                      <Link key={child.href} href={child.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue first:rounded-t-xl last:rounded-b-xl">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', textColor, 'hover:text-brand-blue hover:bg-brand-blue/5',
                    pathname === link.href && 'text-brand-blue bg-brand-blue/5')}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className={cn(isHome && !scrolled ? 'text-white hover:bg-white/10' : '')}>
                    Dashboard
                  </Button>
                </Link>
                <Button size="sm" onClick={logout} variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className={cn(isHome && !scrolled ? 'text-white hover:bg-white/10' : '')}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-brand-gold text-brand-blue hover:bg-brand-gold-dark font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={cn('md:hidden p-2 rounded-lg', textColor)}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-2 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-gray-700 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {user ? (
                <Link href="/dashboard">
                  <Button className="w-full bg-brand-blue text-white" onClick={() => setIsOpen(false)}>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-brand-blue text-brand-blue">Sign In</Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-brand-gold text-brand-blue font-semibold">Get Started Free</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
