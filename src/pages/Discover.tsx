import { motion } from 'framer-motion';
import { heritageTimeline } from '@/data/products';
import { ArrowDown } from 'lucide-react';

export default function DiscoverPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        <div className="relative z-20 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.3em] uppercase mb-6 text-white/80 font-medium"
          >
            Since 1858 · Étival · France
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl md:text-6xl text-white font-light tracking-tight mb-8"
          >
            A Heritage of <br />
            <span className="italic">Excellence</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/60 animate-bounce"
          >
            <ArrowDown size={32} strokeWidth={1} />
          </motion.div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-16 md:py-24 container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          <div>
            <span className="text-xs tracking-widest uppercase mb-6 block" style={{ color: 'var(--brand-blue)' }}>
              The Vosges Mill
            </span>
            <h2 className="font-serif text-2xl md:text-4xl mb-8 leading-tight" style={{ color: 'var(--ink-deep)' }}>
              Where water meets <br /> wisdom.
            </h2>
            <div className="space-y-6 text-base leading-relaxed font-light" style={{ color: 'var(--ink-soft)' }}>
              <p>
                In 1858, Jean-Baptiste Bichelberger founded the paper mill in Étival-Clairefontaine, deep in the lush forests of the Vosges valley. He chose this specific location for the exceptional purity of the river Meurthe, whose waters still power our machines today.
              </p>
              <p>
                What began as a small venture soon became a symbol of French craftsmanship. By the late 19th century, Clairefontaine was already renowned for its envelopes and correspondence paper, supplying the intellectual heart of Paris.
              </p>
              <p>
                Today, we remain one of the only European manufacturers to produce our own paper for our own products. This "closed loop" allows us to guarantee a level of consistency and quality that has become legendary among writers and artists worldwide.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&q=80" 
              alt="The history of paper making" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-paper-cream border-y" style={{ borderColor: 'oklch(0.86 0.010 60)' }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <h2 className="font-serif text-3xl mb-4" style={{ color: 'var(--ink-deep)' }}>Our Journey</h2>
            <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--ink-soft)' }}>Two centuries of paper evolution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {heritageTimeline.map((item, idx) => (
              <motion.div 
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative p-8 bg-background border"
                style={{ borderColor: 'oklch(0.86 0.010 60 / 0.5)' }}
              >
                <div className="text-4xl mb-6">{item.icon}</div>
                <h3 className="font-serif text-3xl mb-2" style={{ color: 'var(--brand-blue)' }}>{item.year}</h3>
                <h4 className="font-sans font-semibold text-xs tracking-wider uppercase mb-4" style={{ color: 'var(--ink-mid)' }}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl mb-12 font-light italic" style={{ color: 'var(--ink-deep)' }}>
            "The pleasure of writing, <br /> the precision of art."
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mt-20">
            <div>
              <h5 className="font-semibold text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--brand-blue)' }}>Purity</h5>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Our vellum paper is famous for its "satin" finish — incredibly smooth, acid-free, and remarkably opaque.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--brand-blue)' }}>Ecology</h5>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                We are 80% energy self-sufficient and treat 100% of our water before returning it to the river Meurthe.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--brand-blue)' }}>Legacy</h5>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Every notebook is a promise kept since 1858. Made in France, for the hands of the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-ink-deep text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-4xl mb-8">Ready to start your story?</h2>
          <button 
            onClick={() => window.location.href = '/collections'}
            className="btn-primary-invert inline-flex gap-2"
          >
            Shop the Collections
            <ArrowDown className="-rotate-90" size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
