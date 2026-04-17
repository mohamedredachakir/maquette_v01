import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  products,
  collections,
  filterProducts,
  type Product,
  type PaperType,
  type UseCase,
  type ProductSize,
  type Collection,
} from '@/data/products';

// ── Fade-in on scroll hook ────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
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

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Filter config ─────────────────────────────────────────────────────────────
const paperTypeOptions: { value: PaperType; label: string }[] = [
  { value: 'lined', label: 'Lined' },
  { value: 'dotted', label: 'Dot-grid' },
  { value: 'grid', label: 'Grid' },
  { value: 'blank', label: 'Blank' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'pastel', label: 'Pastel' },
];

const useCaseOptions: { value: UseCase; label: string }[] = [
  { value: 'note-taking', label: 'Note-taking' },
  { value: 'journaling', label: 'Journaling' },
  { value: 'sketching', label: 'Sketching' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'revision', label: 'Study & Revision' },
  { value: 'calligraphy', label: 'Calligraphy' },
  { value: 'manga', label: 'Manga & Comics' },
];

const sizeOptions: { value: ProductSize; label: string }[] = [
  { value: 'A3', label: 'A3' },
  { value: 'A4', label: 'A4' },
  { value: 'A5', label: 'A5' },
  { value: 'A6', label: 'A6' },
  { value: 'B5', label: 'B5' },
];

// ── Filter sidebar ────────────────────────────────────────────────────────────
interface FilterState {
  paperType: PaperType[];
  useCase: UseCase[];
  size: ProductSize[];
}

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (v: T) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b pb-5 mb-5" style={{ borderColor: 'oklch(0.86 0.010 60)' }}>
      <button
        className="w-full flex items-center justify-between mb-3 text-left"
        onClick={() => setOpen(v => !v)}
      >
        <span
          className="text-xs font-semibold tracking-widest uppercase font-sans"
          style={{ color: 'var(--ink-mid)', letterSpacing: '0.14em' }}
        >
          {label}
        </span>
        {open ? (
          <ChevronUp size={14} style={{ color: 'var(--ink-soft)' }} />
        ) : (
          <ChevronDown size={14} style={{ color: 'var(--ink-soft)' }} />
        )}
      </button>
      {open && (
        <div className="flex flex-col gap-2">
          {options.map(opt => {
            const checked = selected.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className="w-4 h-4 border flex items-center justify-center transition-all duration-200 flex-shrink-0"
                  style={{
                    borderColor: checked ? 'var(--brand-blue)' : 'oklch(0.80 0.010 60)',
                    background: checked ? 'var(--brand-blue)' : 'transparent',
                    borderRadius: '2px',
                  }}
                  onClick={() => onToggle(opt.value)}
                >
                  {checked && (
                    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="1,6 4.5,9.5 11,2.5" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-xs font-sans transition-colors duration-200"
                  style={{ color: checked ? 'var(--ink-deep)' : 'var(--ink-soft)' }}
                  onClick={() => onToggle(opt.value)}
                >
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
}: {
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
  onReset: () => void;
}) {
  const toggle = <T extends string>(key: keyof FilterState, value: T) => {
    const arr = filters[key] as T[];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    onFilterChange({ ...filters, [key]: next });
  };

  const hasFilters = filters.paperType.length > 0 || filters.useCase.length > 0 || filters.size.length > 0;

  return (
    <aside>
      <div className="flex items-center justify-between mb-6">
        <span
          className="text-xs font-semibold tracking-widest uppercase font-sans"
          style={{ color: 'var(--ink-deep)', letterSpacing: '0.16em' }}
        >
          Refine
        </span>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs flex items-center gap-1 transition-colors duration-200 hover:text-primary font-sans"
            style={{ color: 'var(--ink-soft)', letterSpacing: '0.1em' }}
          >
            <X size={11} />
            Clear all
          </button>
        )}
      </div>

      <FilterGroup
        label="Paper type"
        options={paperTypeOptions}
        selected={filters.paperType}
        onToggle={(v) => toggle('paperType', v)}
      />
      <FilterGroup
        label="Use case"
        options={useCaseOptions}
        selected={filters.useCase}
        onToggle={(v) => toggle('useCase', v)}
      />
      <FilterGroup
        label="Format"
        options={sizeOptions}
        selected={filters.size}
        onToggle={(v) => toggle('size', v)}
      />
    </aside>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <FadeIn delay={delay}>
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        aria-label={`View ${product.title}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="card-paper overflow-hidden"
          style={{
            borderRadius: '2px',
            transform: hovered ? 'translateY(-4px) scale(1.012)' : 'translateY(0) scale(1)',
            transition: 'transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.38s ease',
          }}
        >
          {/* Image block */}
          <div
            className="relative overflow-hidden"
            style={{ height: '280px', background: 'var(--paper-warm)' }}
          >
            <img
              src={hovered && product.textureImage ? product.textureImage : product.coverImage}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{
                transition: 'opacity 0.4s ease, transform 0.5s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
              }}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              {product.madeinFrance && <span className="badge-france">🇫🇷 France</span>}
              {product.acidFree && <span className="badge-acid">pH Neutral</span>}
              {product.pefc && <span className="badge-eco">PEFC</span>}
              {product.new && (
                <span
                  className="text-xs px-2 py-0.5 font-sans font-semibold rounded-full"
                  style={{
                    background: 'var(--brand-red)',
                    color: 'oklch(0.99 0.002 70)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                  }}
                >
                  New
                </span>
              )}
            </div>

            {/* Paper-texture hover reveal */}
            {product.textureImage && (
              <div
                className="absolute bottom-4 right-4 text-xs font-sans tracking-wider transition-opacity duration-300"
                style={{
                  color: 'oklch(0.90 0.004 70)',
                  letterSpacing: '0.14em',
                  opacity: hovered ? 1 : 0,
                  textTransform: 'uppercase',
                  textShadow: '0 1px 4px oklch(0 0 0 / 0.5)',
                }}
              >
                Paper detail ↗
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5 md:p-6">
            <p
              className="text-xs tracking-widest uppercase mb-1 font-sans"
              style={{ color: 'var(--ink-soft)', letterSpacing: '0.14em' }}
            >
              {product.series}
            </p>

            <h3
              className="font-serif text-base md:text-lg font-normal mb-2 leading-snug"
              style={{ color: 'var(--ink-deep)' }}
            >
              {product.title}
            </h3>

            {/* One-line benefit */}
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--ink-soft)' }}>
              {product.gsm} g/m² · {product.pages} pages · {product.size} · {product.binding}
            </p>

            {/* Spec tags */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-1.5 flex-wrap">
                {product.paperType.slice(0, 2).map(t => (
                  <span key={t} className="spec-tag capitalize">{t}</span>
                ))}
                {product.useCase.slice(0, 1).map(u => (
                  <span key={u} className="spec-tag capitalize">{u.replace('-', ' ')}</span>
                ))}
              </div>
              <span className="font-serif text-lg" style={{ color: 'var(--brand-blue)' }}>
                €{product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}

// ── Mobile filter modal ───────────────────────────────────────────────────────
function MobileFilterModal({
  open,
  onClose,
  filters,
  onFilterChange,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
  onReset: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="relative z-10 rounded-t-lg p-6 overflow-y-auto"
        style={{
          background: 'var(--background)',
          maxHeight: '85vh',
          boxShadow: '0 -8px 40px oklch(0.22 0.015 35 / 0.15)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl" style={{ color: 'var(--ink-deep)' }}>
            Refine
          </h3>
          <button onClick={onClose} style={{ color: 'var(--ink-mid)' }}>
            <X size={20} />
          </button>
        </div>
        <FilterSidebar filters={filters} onFilterChange={onFilterChange} onReset={onReset} />
        <button className="btn-primary w-full justify-center mt-4" onClick={onClose}>
          Apply filters
        </button>
        {(filters.paperType.length > 0 || filters.useCase.length > 0 || filters.size.length > 0) && (
          <button
            className="btn-outline w-full justify-center mt-3"
            onClick={() => { onReset(); onClose(); }}
          >
            Reset all
          </button>
        )}
      </div>
    </div>
  );
}

// ── Collection listing page ───────────────────────────────────────────────────
export default function ProductListingPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [filters, setFilters] = useState<FilterState>({ paperType: [], useCase: [], size: [] });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Determine which products to show
  const activeCollection = collectionId as Collection | undefined;
  const collectionInfo = activeCollection
    ? collections.find(c => c.id === activeCollection)
    : null;

  const baseProducts = activeCollection
    ? products.filter(p => p.collection === activeCollection)
    : products;

  const filtered = filterProducts(baseProducts, {
    paperType: filters.paperType.length ? filters.paperType : undefined,
    useCase: filters.useCase.length ? filters.useCase : undefined,
    size: filters.size.length ? filters.size : undefined,
  });

  const activeFilterCount = filters.paperType.length + filters.useCase.length + filters.size.length;

  return (
    <>
      {/* ── Collection hero header ── */}
      <div
        className="relative overflow-hidden py-14 md:py-20"
        style={{ background: 'var(--paper-cream)', borderBottom: '1px solid oklch(0.86 0.010 60)' }}
      >
        {collectionInfo && (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(${collectionInfo.heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'saturate(0)',
            }}
          />
        )}
        <div className="relative container mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link
              to="/"
              className="text-xs font-sans tracking-wider hover:text-primary transition-colors"
              style={{ color: 'var(--ink-soft)', letterSpacing: '0.12em' }}
            >
              Home
            </Link>
            <span style={{ color: 'var(--ink-soft)' }} className="text-xs">/</span>
            {collectionInfo ? (
              <span
                className="text-xs font-sans tracking-wider"
                style={{ color: 'var(--ink-mid)', letterSpacing: '0.12em' }}
              >
                {collectionInfo.subtitle}
              </span>
            ) : (
              <span
                className="text-xs font-sans tracking-wider"
                style={{ color: 'var(--ink-mid)', letterSpacing: '0.12em' }}
              >
                All Products
              </span>
            )}
          </div>

          <p
            className="text-xs tracking-widest uppercase mb-2 font-sans"
            style={{ color: 'var(--ink-soft)', letterSpacing: '0.18em' }}
          >
            {collectionInfo?.subtitle || 'All Collections'}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4" style={{ color: 'var(--ink-deep)' }}>
            {collectionInfo?.title.replace('.', '') || 'Every paper, every surface.'}
          </h1>
          {collectionInfo && (
            <p
              className="text-base leading-relaxed max-w-xl"
              style={{ color: 'var(--ink-soft)', fontWeight: 300 }}
            >
              {collectionInfo.story}
            </p>
          )}
        </div>
      </div>

      {/* ── Main listing ── */}
      <div className="container mx-auto px-6 md:px-12 py-10 md:py-14">
        {/* Top bar */}
        <div
          className="flex items-center justify-between mb-8 pb-4"
          style={{ borderBottom: '1px solid oklch(0.86 0.010 60)' }}
        >
          <p className="text-xs font-sans" style={{ color: 'var(--ink-soft)' }}>
            Showing <strong style={{ color: 'var(--ink-deep)' }}>{filtered.length}</strong> products
            {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
          </p>

          {/* Mobile filter toggle */}
          <button
            className="md:hidden flex items-center gap-2 btn-outline text-xs py-2 px-4"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: 'var(--brand-blue)', color: 'oklch(0.99 0.002 70)', fontSize: '0.6rem' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop sort label */}
          <div className="hidden md:flex items-center gap-2">
            <SlidersHorizontal size={13} style={{ color: 'var(--ink-soft)' }} />
            <span
              className="text-xs font-sans"
              style={{ color: 'var(--ink-soft)', letterSpacing: '0.1em' }}
            >
              Use the filters on the left to narrow your selection
            </span>
          </div>
        </div>

        {/* 2-col layout */}
        <div className="flex gap-10 md:gap-14">
          {/* Filter sidebar — desktop */}
          <div
            className="hidden md:block flex-shrink-0"
            style={{ width: '220px', minWidth: '220px' }}
          >
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onReset={() => setFilters({ paperType: [], useCase: [], size: [] })}
            />

            {/* "Made in France" callout */}
            <div
              className="mt-8 p-5"
              style={{
                background: 'var(--paper-cream)',
                border: '1px solid oklch(0.86 0.010 60)',
                borderRadius: '2px',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🇫🇷</span>
                <span
                  className="text-xs font-semibold tracking-wider uppercase font-sans"
                  style={{ color: 'var(--brand-blue)', letterSpacing: '0.12em' }}
                >
                  Made in France
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Every product in our range is manufactured in Étival-Clairefontaine, Vosges — since 1858.
              </p>
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p
                  className="font-serif text-2xl mb-3"
                  style={{ color: 'var(--ink-deep)' }}
                >
                  No products match your selection.
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
                  Try removing a filter or exploring another collection.
                </p>
                <button
                  className="btn-outline"
                  onClick={() => setFilters({ paperType: [], useCase: [], size: [] })}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} delay={i * 0.06} />
                ))}
              </div>
            )}

            {/* Pagination placeholder */}
            {filtered.length > 0 && (
              <div
                className="flex justify-center mt-16 pt-10"
                style={{ borderTop: '1px solid oklch(0.86 0.010 60)' }}
              >
                <div className="flex items-center gap-6">
                  <button
                    className="text-xs font-sans tracking-wider uppercase"
                    style={{ color: 'var(--ink-soft)', letterSpacing: '0.14em' }}
                  >
                    ← Previous
                  </button>
                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--ink-mid)' }}
                  >
                    Page 1
                  </span>
                  <button
                    className="text-xs font-sans tracking-wider uppercase"
                    style={{ color: 'var(--ink-mid)', letterSpacing: '0.14em' }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Cross-collection navigation ── */}
      <div
        className="py-16 mt-8"
        style={{ background: 'var(--paper-cream)', borderTop: '1px solid oklch(0.86 0.010 60)' }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <p
            className="text-xs tracking-widest uppercase mb-8 font-sans text-center"
            style={{ color: 'var(--ink-soft)', letterSpacing: '0.18em' }}
          >
            Explore other collections
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {collections
              .filter(c => c.id !== activeCollection)
              .map(col => (
                <Link
                  key={col.id}
                  to={col.link}
                  className="inline-flex items-center gap-2 btn-outline text-xs py-2.5 px-6"
                >
                  {col.subtitle}
                  <ArrowRight size={12} />
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Mobile filter modal */}
      <MobileFilterModal
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters({ paperType: [], useCase: [], size: [] })}
      />
    </>
  );
}
