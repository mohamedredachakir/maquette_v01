import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Gift, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { getProductBySlug, products, type SuitabilityItem, type Product } from '@/data/products';
import { useCart } from '@/hooks/useCart';

// ── Fade-in hook ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

// ── Image gallery ─────────────────────────────────────────────────────────────
function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative overflow-hidden group cursor-zoom-in"
        style={{
          aspectRatio: '4/3',
          background: 'var(--paper-warm)',
          borderRadius: '2px',
          border: '1px solid oklch(0.86 0.010 60)',
        }}
        onClick={() => setZoomed(!zoomed)}
        aria-label="Click to zoom"
      >
        <img
          src={images[active]}
          alt={`${title} — view ${active + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: zoomed ? 'scale(1.6)' : 'scale(1)' }}
          loading="eager"
        />
        <div
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <div
            className="p-2 rounded-sm"
            style={{ background: 'oklch(0.99 0.002 70 / 0.85)', backdropFilter: 'blur(4px)' }}
          >
            <ZoomIn size={14} style={{ color: 'var(--ink-mid)' }} />
          </div>
        </div>

        {/* Prev/next */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: 'oklch(0.99 0.002 70 / 0.85)',
                backdropFilter: 'blur(4px)',
                borderRadius: '2px',
              }}
              onClick={(e) => { e.stopPropagation(); setActive(a => (a - 1 + images.length) % images.length); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={16} style={{ color: 'var(--ink-mid)' }} />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: 'oklch(0.99 0.002 70 / 0.85)',
                backdropFilter: 'blur(4px)',
                borderRadius: '2px',
              }}
              onClick={(e) => { e.stopPropagation(); setActive(a => (a + 1) % images.length); }}
              aria-label="Next image"
            >
              <ChevronRight size={16} style={{ color: 'var(--ink-mid)' }} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className="relative overflow-hidden"
              style={{
                aspectRatio: '1/1',
                borderRadius: '2px',
                border: i === active
                  ? '2px solid var(--brand-blue)'
                  : '1px solid oklch(0.86 0.010 60)',
                opacity: i === active ? 1 : 0.65,
                transition: 'opacity 0.2s ease, border-color 0.2s ease',
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Caption hint */}
      <p className="text-xs text-center font-sans" style={{ color: 'var(--ink-soft)', letterSpacing: '0.1em' }}>
        {active === 0 ? 'Cover view' : active === 1 ? 'Paper texture close-up' : `Detail view ${active}`}
        {images.length > 1 && ` · ${active + 1} / ${images.length}`}
      </p>
    </div>
  );
}

// ── Suitability matrix ────────────────────────────────────────────────────────
function SuitabilityMatrix({ items }: { items: SuitabilityItem[] }) {
  const levelLabel: Record<string, string> = {
    compatible: 'Excellent',
    warning: 'Usable',
    incompatible: 'Not suitable',
    neutral: 'Fair',
  };
  const levelColor: Record<string, string> = {
    compatible: 'var(--sage-green)',
    warning: 'var(--heritage-gold)',
    incompatible: 'var(--brand-red-muted)',
    neutral: 'var(--ink-soft)',
  };

  return (
    <div>
      <h3
        className="text-xs font-semibold tracking-widest uppercase font-sans mb-4"
        style={{ color: 'var(--ink-mid)', letterSpacing: '0.14em' }}
      >
        Paper suitability
      </h3>
      <div
        className="rounded-sm overflow-hidden"
        style={{ border: '1px solid oklch(0.86 0.010 60)' }}
      >
        {items.map((item, i) => (
          <div
            key={item.tool}
            className="flex items-center gap-4 px-4 py-3 transition-colors duration-150"
            style={{
              borderBottom: i < items.length - 1 ? '1px solid oklch(0.90 0.008 60)' : 'none',
              background: i % 2 === 0 ? 'var(--background)' : 'var(--paper-cream)',
            }}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans font-medium" style={{ color: 'var(--ink-deep)' }}>
                {item.tool}
              </p>
              {item.note && (
                <p className="text-xs font-sans" style={{ color: 'var(--ink-soft)' }}>
                  {item.note}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Visual indicator dots */}
              <div className="flex gap-1">
                {[0, 1, 2].map(dot => (
                  <div
                    key={dot}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: item.level === 'compatible' && dot <= 2
                        ? levelColor[item.level]
                        : item.level === 'neutral' && dot <= 1
                        ? levelColor[item.level]
                        : item.level === 'warning' && dot === 0
                        ? levelColor[item.level]
                        : 'oklch(0.86 0.010 60)',
                    }}
                  />
                ))}
              </div>
              <span
                className="text-xs font-mono"
                style={{ color: levelColor[item.level], minWidth: '80px', textAlign: 'right' }}
              >
                {levelLabel[item.level]}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs mt-2 font-sans" style={{ color: 'var(--ink-soft)' }}>
        ● Excellent &nbsp; ●● Usable &nbsp; ●●● Not suitable
      </p>
    </div>
  );
}

// ── Add to cart panel ─────────────────────────────────────────────────────────
function AddToCart({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart, openCart } = useCart();

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2400);
  };

  const finalPrice = product.price * qty + (giftWrap ? 2.5 : 0);

  return (
    <div
      className="p-6"
      style={{
        background: 'var(--paper-cream)',
        border: '1px solid oklch(0.86 0.010 60)',
        borderRadius: '2px',
      }}
    >
      {/* Price */}
      <div className="flex items-end gap-3 mb-6">
        <span className="font-serif text-2xl" style={{ color: 'var(--ink-deep)' }}>
          €{product.price.toFixed(2)}
        </span>
        <span className="text-xs font-sans pb-1" style={{ color: 'var(--ink-soft)' }}>
          incl. VAT
        </span>
      </div>

      {/* Quantity selector */}
      <div className="mb-5">
        <label
          className="block text-xs font-sans font-semibold tracking-widest uppercase mb-2"
          style={{ color: 'var(--ink-mid)', letterSpacing: '0.12em' }}
          htmlFor="qty-select"
        >
          Quantity
        </label>
        <select
          id="qty-select"
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
          className="w-full text-sm font-sans py-2.5 px-3 appearance-none cursor-pointer focus:outline-none focus:ring-2"
          style={{
            background: 'var(--background)',
            border: '1px solid oklch(0.86 0.010 60)',
            color: 'var(--ink-deep)',
            borderRadius: '2px',
          }}
        >
          {[1, 2, 3, 5, 10].map(n => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'notebook' : 'notebooks'}
            </option>
          ))}
        </select>
      </div>

      {/* Gift wrap */}
      <div className="mb-6 flex items-start gap-3 cursor-pointer group" onClick={() => setGiftWrap(v => !v)}>
        <div
          className="w-4 h-4 mt-0.5 border flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            borderColor: giftWrap ? 'var(--brand-blue)' : 'oklch(0.80 0.010 60)',
            background: giftWrap ? 'var(--brand-blue)' : 'transparent',
            borderRadius: '2px',
          }}
        >
          {giftWrap && (
            <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="white" strokeWidth="2">
              <polyline points="1,6 4.5,9.5 11,2.5" />
            </svg>
          )}
        </div>
        <div>
          <span className="text-xs font-sans block" style={{ color: 'var(--ink-mid)' }}>
            <Gift size={12} className="inline mr-1" />
            Add gift wrapping (+€2.50)
          </span>
          <p className="text-xs" style={{ color: 'var(--ink-soft)', fontSize: '0.68rem' }}>
            Linen ribbon, kraft paper, wax seal
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleAdd}
        className="btn-primary w-full justify-center"
        aria-label={`Add ${product.title} to cart`}
      >
        {added ? (
          <>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="2,8 6,12 14,4" />
            </svg>
            Added to bag
          </>
        ) : (
          <>
            <ShoppingBag size={14} strokeWidth={1.5} />
            Add to bag — €{finalPrice.toFixed(2)}
          </>
        )}
      </button>

      <p className="text-xs text-center mt-3 font-sans" style={{ color: 'var(--ink-soft)' }}>
        Free delivery on orders over €40 · Made in France
      </p>
    </div>
  );
}

// ── Product Detail Page ───────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4" style={{ color: 'var(--ink-deep)' }}>
          Product not found.
        </h1>
        <button className="btn-outline" onClick={() => navigate(-1)}>
          ← Go back
        </button>
      </div>
    );
  }

  // Related products — same collection, different product
  const related = products
    .filter(p => p.collection === product.collection && p.id !== product.id)
    .slice(0, 3);

  return (
    <>
      {/* Breadcrumb */}
      <div
        className="py-4 border-b"
        style={{ borderColor: 'oklch(0.86 0.010 60)', background: 'var(--paper-cream)' }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center gap-2 text-xs font-sans" style={{ color: 'var(--ink-soft)', letterSpacing: '0.10em' }}>
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link
              to={`/collections/${product.collection}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {product.collection.replace('-', ' ')}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--ink-mid)' }}>{product.series}</span>
          </div>
        </div>
      </div>

      {/* Main split layout */}
      <div className="container mx-auto px-6 md:px-12 py-8 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-20">

          {/* ── Left: Image gallery ── */}
          <div>
            <FadeIn>
              <ImageGallery images={product.galleryImages} title={product.title} />
            </FadeIn>
          </div>

          {/* ── Right: Product info ── */}
          <div className="flex flex-col gap-6">
            <FadeIn delay={0.1}>
              {/* Series + badges */}
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span
                  className="text-xs font-sans font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--ink-soft)', letterSpacing: '0.16em' }}
                >
                  {product.series}
                </span>
                {product.madeinFrance && <span className="badge-france">🇫🇷 Made in France</span>}
                {product.acidFree && <span className="badge-acid">pH Neutral</span>}
                {product.pefc && <span className="badge-eco">PEFC</span>}
                {product.new && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-sans font-semibold uppercase"
                    style={{ background: 'var(--brand-red)', color: 'oklch(0.99 0.002 70)', fontSize: '0.58rem', letterSpacing: '0.10em' }}
                  >
                    New
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                className="font-serif text-2xl md:text-3xl font-light leading-tight mb-2"
                style={{ color: 'var(--ink-deep)' }}
              >
                {product.title}
              </h1>

              {/* Tagline */}
              <p
                className="font-serif text-base italic font-light mb-4"
                style={{ color: 'var(--ink-soft)' }}
              >
                "{product.tagline}"
              </p>

              {/* Editorial description */}
              <p
                className="text-sm leading-loose mb-6"
                style={{ color: 'var(--ink-mid)', fontWeight: 300 }}
              >
                {product.description}
              </p>
            </FadeIn>

            {/* Quick specs row */}
            <FadeIn delay={0.18}>
              <div
                className="flex flex-wrap gap-2 py-4"
                style={{ borderTop: '1px solid oklch(0.86 0.010 60)', borderBottom: '1px solid oklch(0.86 0.010 60)' }}
              >
                <span className="spec-tag">{product.gsm} g/m²</span>
                <span className="spec-tag">{product.size}</span>
                <span className="spec-tag">{product.pages} pages</span>
                <span className="spec-tag">{product.paperType.join(', ')}</span>
                <span className="spec-tag">{product.binding}</span>
                <div
                  className="inline-flex items-center gap-1.5 spec-tag"
                  title={`Colour: ${product.color}`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full border border-black/10"
                    style={{ background: product.colorHex }}
                  />
                  {product.color}
                </div>
              </div>
            </FadeIn>

            {/* Add to cart */}
            <FadeIn delay={0.25}>
              <AddToCart product={product} />
            </FadeIn>

            {/* Usage hint */}
            <FadeIn delay={0.32}>
              <div
                className="p-4 rounded-sm"
                style={{
                  background: 'oklch(0.32 0.09 225 / 0.05)',
                  border: '1px solid oklch(0.32 0.09 225 / 0.15)',
                }}
              >
                <p className="text-xs font-sans" style={{ color: 'var(--brand-blue)' }}>
                  <strong>Best used for:</strong>{' '}
                  {product.useCase.map(u => u.replace('-', ' ')).join(', ')}.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ── Long description ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-20 pt-10" style={{ borderTop: '1px solid oklch(0.86 0.010 60)' }}>
          <FadeIn>
            <p
              className="text-xs font-sans font-semibold tracking-widest uppercase mb-5"
              style={{ color: 'var(--ink-soft)', letterSpacing: '0.18em' }}
            >
              About this paper
            </p>
            <p
              className="text-sm md:text-base leading-loose font-serif font-light"
              style={{ color: 'var(--ink-mid)' }}
            >
              {product.longDescription}
            </p>
          </FadeIn>

          {/* ── Technical specs ── */}
          <FadeIn delay={0.1}>
            <p
              className="text-xs font-sans font-semibold tracking-widest uppercase mb-5"
              style={{ color: 'var(--ink-soft)', letterSpacing: '0.18em' }}
            >
              Specifications
            </p>
            <dl className="flex flex-col">
              {Object.entries(product.specs).map(([key, val], i) => (
                <div
                  key={key}
                  className="flex gap-4 py-2.5"
                  style={{ borderBottom: '1px solid oklch(0.90 0.008 60)', background: i % 2 === 0 ? 'transparent' : 'var(--paper-cream)' }}
                >
                  <dt
                    className="text-xs font-sans font-medium flex-shrink-0"
                    style={{ color: 'var(--ink-soft)', width: '140px' }}
                  >
                    {key}
                  </dt>
                  <dd className="text-xs font-mono" style={{ color: 'var(--ink-deep)' }}>
                    {val}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>

        {/* ── Suitability matrix ── */}
        <div className="mb-20">
          <FadeIn>
            <SuitabilityMatrix items={product.suitability} />
          </FadeIn>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div
            className="pt-12"
            style={{ borderTop: '1px solid oklch(0.86 0.010 60)' }}
          >
            <FadeIn className="mb-8">
              <p
                className="text-xs font-sans font-semibold tracking-widest uppercase mb-2"
                style={{ color: 'var(--ink-soft)', letterSpacing: '0.18em' }}
              >
                From the same collection
              </p>
              <h2 className="font-serif text-2xl font-light" style={{ color: 'var(--ink-deep)' }}>
                You may also want.
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.1}>
                  <Link
                    to={`/product/${p.slug}`}
                    className="group card-paper product-card-hover block overflow-hidden"
                    style={{ borderRadius: '2px' }}
                  >
                    <div className="relative overflow-hidden" style={{ height: '200px', background: 'var(--paper-warm)' }}>
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-sans" style={{ color: 'var(--ink-soft)', letterSpacing: '0.12em' }}>
                        {p.series}
                      </p>
                      <h3 className="font-serif text-sm font-normal mt-1 mb-2 leading-snug" style={{ color: 'var(--ink-deep)' }}>
                        {p.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="spec-tag">{p.gsm} g/m²</span>
                        <span className="font-serif text-base" style={{ color: 'var(--brand-blue)' }}>
                          €{p.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Back to collection ── */}
      <div
        className="py-12"
        style={{ background: 'var(--paper-cream)', borderTop: '1px solid oklch(0.86 0.010 60)' }}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-center">
          <Link
            to={`/collections/${product.collection}`}
            className="inline-flex items-center gap-2 btn-outline"
          >
            <ArrowLeft size={13} />
            Back to {product.collection.replace('-', ' ')} collection
          </Link>
        </div>
      </div>
    </>
  );
}
