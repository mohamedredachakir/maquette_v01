import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Notebooks', href: '/collections/notebooks' },
  { label: 'Fine Art', href: '/collections/fine-art' },
  { label: 'School', href: '/collections/school' },
  { label: 'Discover', href: '/discover' },
];

import SearchModal from './SearchModal';
import CartDrawer from './CartDrawer';
import { useCart } from '@/hooks/useCart';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalItems, isOpen: cartOpen, setOpen: setCartOpen } = useCart();
  const itemCount = totalItems();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      {/* ── Top announcement bar ── */}
      <div
        className="w-full py-2 text-center"
        style={{ background: 'var(--brand-blue)', color: 'oklch(0.99 0.002 70)' }}
      >
        <p className="text-xs tracking-widest uppercase font-sans">
          Made in France since 1858 · Free delivery on orders over €40
        </p>
      </div>

      {/* ── Navigation ── */}
      <header
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'oklch(0.985 0.004 70 / 0.95)'
            : 'oklch(0.985 0.004 70)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid oklch(0.86 0.010 60 / 0.7)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 20px oklch(0.22 0.015 35 / 0.05)' : 'none',
        }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="w-7 h-7 flex items-center justify-center text-[10px] font-bold transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: 'var(--brand-blue)',
                  color: 'oklch(0.99 0.002 70)',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              >
                {/* La Verseuse triangle */}
              </div>
              <div>
                <span
                  className="block tracking-widest uppercase text-xs font-semibold"
                  style={{ color: 'var(--brand-blue)', letterSpacing: '0.20em', lineHeight: 1 }}
                >
                  Clairefontaine
                </span>
                <span
                  className="block text-xs tracking-wider"
                  style={{ color: 'var(--ink-soft)', fontSize: '0.58rem', letterSpacing: '0.15em' }}
                >
                  ÉTIVAL · FRANCE · EST. 1858
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="nav-link"
                  style={{
                    color: location.pathname.startsWith(item.href)
                      ? 'var(--brand-blue)'
                      : undefined,
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="p-1.5 transition-colors duration-200 hover:text-primary"
                style={{ color: 'var(--ink-mid)' }}
              >
                <Search size={14} strokeWidth={1.5} />
              </button>
              <button
                aria-label="Cart"
                onClick={() => setCartOpen(true)}
                className="p-1.5 transition-colors duration-200 hover:text-primary relative"
                style={{ color: 'var(--ink-mid)' }}
              >
                <ShoppingBag size={14} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-3.5 h-3.5 flex items-center justify-center rounded-full text-[8px] font-bold"
                    style={{ background: 'var(--brand-blue)', color: 'white' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
              <Link to="/collections/notebooks" className="btn-primary py-1.5 px-4">
                Shop Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2"
              style={{ color: 'var(--ink-mid)' }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden border-t"
              style={{
                background: 'var(--paper-cream)',
                borderColor: 'oklch(0.86 0.010 60)',
              }}
            >
              <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="nav-link text-sm py-1"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="divider-rule my-2" />
                <Link to="/collections/notebooks" className="btn-primary self-start text-xs">
                  Shop Now
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer
        className="py-10 md:py-14 mt-16"
        style={{
          background: 'var(--paper-cream)',
          borderTop: '1px solid oklch(0.86 0.010 60)',
        }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-7 h-7"
                  style={{
                    background: 'var(--brand-blue)',
                    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  }}
                />
                <span
                  className="tracking-widest uppercase text-xs font-semibold"
                  style={{ color: 'var(--brand-blue)', letterSpacing: '0.18em' }}
                >
                  Clairefontaine
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Fine paper, notebooks, and art materials. Handcrafted in the Vosges Valley, France, since 1858.
              </p>
              <div className="flex gap-2 mt-5 flex-wrap">
                <span className="badge-france">🇫🇷 Made in France</span>
                <span className="badge-eco">♻️ PEFC</span>
                <span className="badge-acid">🧪 Acid-Free</span>
              </div>
            </div>

            {/* Nav columns */}
            {[
              {
                heading: 'Collections',
                links: ['Notebooks', 'Fine Art', 'School Supplies', 'Accessories'],
              },
              {
                heading: 'Heritage',
                links: ['Our Story', 'Sustainability', 'The Vosges Mill', 'Press Room'],
              },
              {
                heading: 'Support',
                links: ['Shipping & Returns', 'Care Guide', 'Paper Guide', 'Contact'],
              },
            ].map(col => (
              <div key={col.heading}>
                <h4
                  className="text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ color: 'var(--ink-mid)', letterSpacing: '0.14em' }}
                >
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-xs link-editorial"
                        style={{ color: 'var(--ink-soft)' }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="divider-rule mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
              © 2026 Clairefontaine — Exacompta Clairefontaine Group. All rights reserved.
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: 'var(--ink-soft)', fontSize: '0.65rem' }}
            >
              Étival-Clairefontaine · Vosges · France
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
