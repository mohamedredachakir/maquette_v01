import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, type Product } from '@/data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Product[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.series.toLowerCase().includes(query.toLowerCase()) ||
        p.collection.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filtered);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    navigate(`/product/${slug}`);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-background shadow-2xl overflow-hidden border"
            style={{ borderColor: 'oklch(0.86 0.010 60)' }}
          >
            <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: 'oklch(0.86 0.010 60)' }}>
              <Search className="mr-3 opacity-50" size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, collections, heritage..."
                className="w-full bg-transparent border-none outline-none text-sm py-2 font-sans"
              />
              {isSearching ? (
                <Loader2 className="animate-spin opacity-50" size={18} />
              ) : (
                <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="py-2">
                  <p className="px-3 text-[10px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ color: 'var(--ink-soft)' }}>
                    Products
                  </p>
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product.slug)}
                      className="w-full text-left px-3 py-3 rounded-sm hover:bg-paper-cream flex items-center gap-4 transition-colors group"
                    >
                      <div className="w-12 h-12 flex-shrink-0 bg-paper-warm overflow-hidden rounded-[1px]">
                        <img src={product.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-serif group-hover:text-primary transition-colors">{product.title}</h4>
                        <p className="text-[10px] tracking-widest uppercase opacity-60">{product.series}</p>
                      </div>
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="py-12 text-center">
                  <p className="text-sm opacity-60 italic">No matches found for "{query}"</p>
                </div>
              ) : (
                <div className="py-4">
                  <p className="px-3 text-[10px] tracking-[0.2em] uppercase font-semibold mb-3" style={{ color: 'var(--ink-soft)' }}>
                    Popular Categories
                  </p>
                  <div className="flex flex-wrap gap-2 px-3">
                    {['Notebooks', 'Fine Art', 'School', 'Accessories'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => { navigate(`/collections/${cat.toLowerCase().replace(' ', '-')}`); onClose(); }}
                        className="px-4 py-1.5 border rounded-full text-xs hover:border-primary hover:text-primary transition-all"
                        style={{ borderColor: 'oklch(0.86 0.010 60)' }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-paper-cream px-4 py-2 text-[10px] tracking-wider uppercase opacity-40 border-t" style={{ borderColor: 'oklch(0.86 0.010 60)' }}>
              Press Esc to close
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
