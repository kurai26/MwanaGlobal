import Link from 'next/link';
import { Globe, Mail, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Student Profiles', href: '/dashboard' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Success Stories', href: '/#success-stories' },
  ],
  Institutions: [
    { label: 'Universities', href: '/institutions/universities' },
    { label: 'Scouts & Coaches', href: '/institutions/scouts' },
    { label: 'School Counselors', href: '/institutions/counselors' },
    { label: 'Partner With Us', href: '/partner' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Data Protection', href: '/data-protection' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-brand-gold" />
              </div>
              <span className="font-display font-bold text-xl text-white">Mwana Global</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Discover Where Your Talent Can Take You. Zimbabwe's leading student opportunity platform connecting students with scholarships, universities, and sports recruitment worldwide.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/MwanaGlobal" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Mwana Global. All rights reserved. Built for Zimbabwean Excellence.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Mail className="w-4 h-4" />
            <a href="mailto:hello@mwanaglobal.com" className="hover:text-white transition-colors">
              hello@mwanaglobal.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
