import { useCart } from '@/hooks/useCart';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-background border-l" style={{ borderColor: 'oklch(0.86 0.010 60)' }}>
        <SheetHeader className="p-6 border-b" style={{ borderColor: 'oklch(0.86 0.010 60)' }}>
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl flex items-center gap-3">
              <ShoppingBag size={20} />
              Your Bag
              <span className="text-xs font-sans tracking-widest uppercase ml-1 opacity-50">
                ({totalItems()})
              </span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-paper-cream rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={24} style={{ color: 'var(--ink-soft)' }} />
              </div>
              <p className="font-serif text-lg mb-2" style={{ color: 'var(--ink-deep)' }}>Your bag is empty</p>
              <p className="text-xs mb-8 max-w-[200px]" style={{ color: 'var(--ink-soft)' }}>
                Start adding heritage stationery to your collection.
              </p>
              <Link
                to="/collections"
                onClick={onClose}
                className="btn-primary text-xs py-2 px-6"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 pb-6 border-b"
                    style={{ borderColor: 'oklch(0.86 0.010 60 / 0.5)' }}
                  >
                    <div className="w-20 h-24 bg-paper-warm overflow-hidden rounded-[1px] flex-shrink-0">
                      <img
                        src={item.product.coverImage}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-[9px] tracking-widest uppercase opacity-60">
                            {item.product.series}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 hover:text-red-600 transition-colors opacity-40 hover:opacity-100"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <Link 
                          to={`/product/${item.product.slug}`} 
                          onClick={onClose}
                          className="font-serif text-sm hover:text-primary transition-colors block leading-tight mb-2 pr-4 truncate"
                        >
                          {item.product.title}
                        </Link>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded-[1px]" style={{ borderColor: 'oklch(0.86 0.010 60)' }}>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-paper-cream transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-8 text-center text-[11px] font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-paper-cream transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <p className="font-serif text-sm" style={{ color: 'var(--brand-blue)' }}>
                          €{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-paper-cream border-t" style={{ borderColor: 'oklch(0.86 0.010 60)' }}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--ink-soft)' }}>Subtotal</span>
              <span className="font-serif text-2xl" style={{ color: 'var(--brand-blue)' }}>€{totalPrice().toFixed(2)}</span>
            </div>
            
            <p className="text-[10px] mb-4 text-center italic" style={{ color: 'var(--ink-soft)' }}>
              Shipping and taxes calculated at checkout.
            </p>

            <button className="btn-primary w-full justify-center py-4 text-xs tracking-[0.2em] uppercase">
              Checkout
              <ArrowRight size={14} className="ml-2" />
            </button>
            
            <button 
              onClick={onClose}
              className="w-full text-center mt-4 text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
