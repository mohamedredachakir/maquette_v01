import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, FlaskConical, MapPin, ChevronDown } from 'lucide-react';
import { collections, getFeaturedProducts, heritageTimeline } from '@/data/products';

// ── Intersection observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Fade-in wrapper ──────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Hero section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1800&q=90"
          alt="Clairefontaine paper texture"
          className="w-full h-full object-cover"
          loading="eager"
          style={{ filter: 'brightness(0.55) saturate(0.7)' }}
        />
        {/* Paper-grain overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              oklch(0.22 0.015 35 / 0.2) 50%,
              oklch(0.22 0.015 35 / 0.85) 100%
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xs tracking-widest uppercase mb-6"
            style={{ color: 'oklch(0.85 0.008 70)', letterSpacing: '0.22em' }}
          >
            Étival-Clairefontaine · Vosges · Est. 1858
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-serif text-4xl md:text-5xl font-light mb-6 leading-none"
            style={{ color: 'oklch(0.98 0.004 70)' }}
          >
            The paper that
            <br />
            <em className="italic font-normal" style={{ color: 'oklch(0.88 0.012 75)' }}>
              never forgets.
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="text-sm md:text-base leading-relaxed mb-10 max-w-md"
            style={{ color: 'oklch(0.82 0.006 70)', fontWeight: 300 }}
          >
            Handcrafted in the Vosges Valley since 1858. Acid-free paper, heritage notebooks, and fine-art surfaces — made to outlast the moment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/collections/notebooks" className="btn-primary">
              Explore Notebooks
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <Link
              to="/collections/fine-art"
              className="btn-outline"
              style={{
                borderColor: 'oklch(0.85 0.006 70 / 0.6)',
                color: 'oklch(0.92 0.005 70)',
              }}
            >
              Fine Art Paper
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: 'oklch(0.70 0.005 70)', letterSpacing: '0.2em' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} style={{ color: 'oklch(0.70 0.005 70)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Collection stories ────────────────────────────────────────────────────────
function CollectionsSection() {
  return (
    <section className="py-12 md:py-20" aria-label="Collections">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn className="mb-16">
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: 'var(--ink-soft)', letterSpacing: '0.2em' }}
          >
            Our collections
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light" style={{ color: 'var(--ink-deep)' }}>
            Every surface tells a story.
          </h2>
        </FadeIn>

        <div className="space-y-6 md:space-y-8">
          {collections.map((col, i) => (
            <FadeIn key={col.id} delay={i * 0.12}>
              <Link
                to={col.link}
                className="group block relative overflow-hidden"
                aria-label={`Explore ${col.title}`}
              >
                <div
                  className="relative h-64 md:h-80 overflow-hidden"
                  style={{ borderRadius: '2px' }}
                >
                  {/* Background image */}
                  <img
                    src={col.heroImage}
                    alt={col.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ filter: 'brightness(0.5) saturate(0.65)' }}
                  />
                  {/* Accent gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(
                        to right,
                        ${col.accentColor}cc 0%,
                        transparent 65%
                      )`,
                    }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <p
                      className="text-xs tracking-widest uppercase mb-2 font-sans"
                      style={{ color: 'oklch(0.80 0.005 70)', letterSpacing: '0.18em' }}
                    >
                      {col.subtitle} · {col.productCount} products
                    </p>
                    <h3
                      className="font-serif text-xl md:text-3xl font-light mb-3 leading-snug"
                      style={{ color: 'oklch(0.97 0.003 70)', maxWidth: '480px' }}
                    >
                      {col.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed mb-5 max-w-md hidden md:block"
                      style={{ color: 'oklch(0.82 0.004 70)', fontWeight: 300 }}
                    >
                      {col.story}
                    </p>
                    <span
                      className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase transition-gap duration-300"
                      style={{ color: 'oklch(0.92 0.005 70)', letterSpacing: '0.16em' }}
                    >
                      Explore collection
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured products ─────────────────────────────────────────────────────────
function FeaturedProducts() {
  const featured = getFeaturedProducts();
  return (
    <section
      className="py-12 md:py-20"
      style={{ background: 'var(--paper-cream)' }}
      aria-label="Featured products"
    >
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: 'var(--ink-soft)', letterSpacing: '0.2em' }}
            >
              Editor's Selection
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light" style={{ color: 'var(--ink-deep)' }}>
              Worth knowing.
            </h2>
          </div>
          <Link
            to="/collections/notebooks"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase link-editorial font-sans"
            style={{ letterSpacing: '0.15em', color: 'var(--ink-mid)' }}
          >
            See all products <ArrowRight size={12} />
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {featured.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.1}>
              <Link
                to={`/product/${product.slug}`}
                className="group card-paper product-card-hover block overflow-hidden"
                style={{ borderRadius: '2px' }}
                aria-label={`View ${product.title}`}
              >
                {/* Image */}
                <div className="relative h-56 md:h-72 overflow-hidden" style={{ background: 'var(--paper-warm)' }}>
                  <img
                    src={product.coverImage}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    {product.madeinFrance && <span className="badge-france">🇫🇷 France</span>}
                    {product.acidFree && <span className="badge-acid">pH Neutral</span>}
                    {product.new && (
                      <span
                        className="text-xs px-2 py-0.5 font-sans font-semibold tracking-wider uppercase rounded-full"
                        style={{
                          background: 'var(--brand-red)',
                          color: 'oklch(0.99 0.002 70)',
                          fontSize: '0.58rem',
                          letterSpacing: '0.10em',
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 md:p-7">
                  <p
                    className="text-xs tracking-wider uppercase mb-1 font-sans"
                    style={{ color: 'var(--ink-soft)', letterSpacing: '0.14em' }}
                  >
                    {product.series}
                  </p>
                  <h3
                    className="font-serif text-xl md:text-2xl font-normal mb-2 leading-snug"
                    style={{ color: 'var(--ink-deep)' }}
                  >
                    {product.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ink-soft)' }}>
                    {product.description.substring(0, 90)}…
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      <span className="spec-tag">{product.gsm} g/m²</span>
                      <span className="spec-tag">{product.size}</span>
                      <span className="spec-tag">{product.pages}p</span>
                    </div>
                    <span
                      className="font-serif text-lg"
                      style={{ color: 'var(--brand-blue)' }}
                    >
                      €{product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Heritage timeline ─────────────────────────────────────────────────────────
function HeritageSection() {
  return (
    <section className="py-16 md:py-24 overflow-hidden" aria-label="Brand heritage">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn className="text-center mb-20">
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: 'var(--ink-soft)', letterSpacing: '0.2em' }}
          >
            Heritage
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light mb-4" style={{ color: 'var(--ink-deep)' }}>
            168 years of the same promise.
          </h2>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--ink-soft)', fontWeight: 300 }}>
            Paper is not a product. It is a commitment — to the hands that hold it, the words it carries, and the time it outlasts.
          </p>
        </FadeIn>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: 'linear-gradient(to bottom, transparent, oklch(0.86 0.010 60) 10%, oklch(0.86 0.010 60) 90%, transparent)' }}
          />

          <div className="flex flex-col gap-0">
            {heritageTimeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <FadeIn key={item.year} delay={i * 0.08}>
                  <div
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    } mb-10 md:mb-0`}
                  >
                    {/* Content block */}
                    <div
                      className={`md:w-1/2 ${
                        isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'
                      } pb-12`}
                    >
                      <div
                        className="inline-block mb-3"
                        style={{
                          background: 'var(--paper-cream)',
                          border: '1px solid oklch(0.86 0.010 60)',
                          borderRadius: '2px',
                          padding: '0.2rem 0.6rem',
                        }}
                      >
                        <span
                          className="font-mono text-xs font-medium"
                          style={{ color: 'var(--brand-blue)', letterSpacing: '0.1em' }}
                        >
                          {item.year}
                        </span>
                      </div>
                      <h3
                        className="font-serif text-xl mb-2 font-normal"
                        style={{ color: 'var(--ink-deep)' }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                        {item.text}
                      </p>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex w-0 relative justify-center">
                      <div
                        className="absolute top-1 w-3 h-3 rounded-full -translate-x-1/2"
                        style={{
                          background: 'var(--brand-blue)',
                          border: '2px solid var(--background)',
                          boxShadow: '0 0 0 3px oklch(0.86 0.010 60)',
                        }}
                      />
                    </div>

                    {/* Empty side */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Sustainability strip ──────────────────────────────────────────────────────
function SustainabilitySection() {
  const pillars = [
    {
      icon: <MapPin size={22} strokeWidth={1.5} />,
      label: 'Made in France',
      sub: 'Every sheet produced in Étival, Vosges',
    },
    {
      icon: <FlaskConical size={22} strokeWidth={1.5} />,
      label: 'Acid-Free Since 1974',
      sub: 'pH-neutral paper for archival longevity',
    },
    {
      icon: <Leaf size={22} strokeWidth={1.5} />,
      label: 'PEFC & FSC Certified',
      sub: 'Responsibly sourced wood fibres',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" strokeWidth="1.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      ),
      label: '80% Self-Sufficient',
      sub: 'Biomass energy from local forest waste',
    },
  ];

  return (
    <section
      className="py-14 md:py-20"
      style={{
        background: 'var(--brand-blue)',
      }}
      aria-label="Sustainability"
    >
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn className="text-center mb-14">
          <p
            className="text-xs tracking-widest uppercase mb-3 font-sans"
            style={{ color: 'oklch(0.75 0.05 220)', letterSpacing: '0.2em' }}
          >
            Our commitment
          </p>
          <h2
            className="font-serif text-2xl md:text-4xl font-light"
            style={{ color: 'oklch(0.98 0.004 70)' }}
          >
            Craft with a conscience.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {pillars.map((p, i) => (
            <FadeIn key={p.label} delay={i * 0.1} className="text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 mb-4 mx-auto"
                style={{
                  background: 'oklch(0.99 0.002 70 / 0.08)',
                  border: '1px solid oklch(0.99 0.002 70 / 0.15)',
                  borderRadius: '2px',
                  color: 'oklch(0.92 0.006 70)',
                }}
              >
                {p.icon}
              </div>
              <h3
                className="font-serif text-sm md:text-base font-normal mb-1"
                style={{ color: 'oklch(0.97 0.004 70)' }}
              >
                {p.label}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.75 0.04 220)', fontWeight: 300 }}>
                {p.sub}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Paper close-up editorial break ───────────────────────────────────────────
function PaperEditorialBreak() {
  return (
    <section className="py-0" aria-label="Editorial image">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[440px] md:min-h-[560px]">
        {/* Image */}
        <div className="relative overflow-hidden order-2 md:order-1 h-64 md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=1200&q=85"
            alt="Close-up of Clairefontaine paper grain and fountain pen ink"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Copy */}
        <div
          className="flex flex-col justify-center px-10 md:px-16 py-16 md:py-24 order-1 md:order-2"
          style={{ background: 'var(--paper-cream)' }}
        >
          <FadeIn>
            <p
              className="text-xs tracking-widest uppercase mb-5 font-sans"
              style={{ color: 'var(--ink-soft)', letterSpacing: '0.18em' }}
            >
              90 g/m² · Vellum finish
            </p>
            <h2
              className="font-serif text-2xl md:text-3xl font-light mb-5 leading-snug"
              style={{ color: 'var(--ink-deep)' }}
            >
              Ink meets paper.
              <br />
              <em className="italic font-normal" style={{ color: 'var(--brand-blue)' }}>Nothing bleeds through.</em>
            </h2>
            <p
              className="text-sm leading-relaxed mb-8 max-w-sm"
              style={{ color: 'var(--ink-soft)', fontWeight: 300 }}
            >
              Our 90 g/m² vellum paper — pH neutral, acid-free since 1974 — was engineered for fountain pens first. Every other instrument is welcome.
            </p>
            <Link to="/collections/notebooks" className="btn-outline self-start">
              Discover notebooks
              <ArrowRight size={13} />
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Homepage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CollectionsSection />
      <PaperEditorialBreak />
      <FeaturedProducts />
      <HeritageSection />
      <SustainabilitySection />
    </>
  );
}
