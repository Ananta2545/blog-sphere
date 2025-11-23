'use client';
import Link from 'next/link';
import { Moon, Sun, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/app/store/useAppStore';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [mounted] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/categories', label: 'Categories' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-teal-600 dark:text-teal-400">
          <div className="w-8 h-8 bg-teal-600 dark:bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-lg dark:shadow-teal-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <span>BlogSphere</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium bg-gray-50 dark:bg-slate-800 rounded-full px-2 py-1 transition-colors">
          {navItems.map(({ href, label }) => (
            <Link
              href={href}
              key={href}
              className={`px-4 py-2 rounded-full transition-colors ${
                pathname === href
                  ? "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* RIGHT SECTION */}
        <div className="flex gap-2 items-center">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all hover:scale-110 cursor-pointer"
          >
            {!mounted ? (
              <div className="w-5 h-5" />
            ) : theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-200"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileOpen && (
        <nav className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-4 py-4">
          <div className="flex flex-col gap-3">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg text-base transition-colors ${
                  pathname === href
                    ? "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    : "text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
