import { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../types';

interface CartQuantityModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (productId: string) => void;
}

export default function CartQuantityModal({ product, onClose, onAddToCart, onViewDetails }: CartQuantityModalProps) {
  const [quantity, setQuantity] = useState(1);

  const specs = Object.entries(product.specs).slice(0, 3);
  const hasMoreSpecs = Object.entries(product.specs).length > 3;

  return (
    <div className="fixed inset-0 bg-[#111111]/85 z-50 flex items-start justify-center pt-16 sm:pt-24 overflow-y-auto">
      <div className="bg-white max-w-md w-full text-left border border-gray-200 shadow-2xl flex flex-col my-4">
        <div className="bg-[#111111] text-white px-5 py-3 flex items-center justify-between border-b border-gray-800">
          <span className="text-[10px] font-mono font-bold text-[#3373AB] uppercase tracking-widest">ESCROW PLACEMENT CONSOLE</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white outline-none cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-dashed border-gray-200">
            <div className="h-16 w-16 bg-gray-100 border border-gray-200 shrink-0">
              <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 leading-tight">{product.name}</h3>
              <p className="text-[10px] font-mono text-gray-400 mt-0.5">OEM: {product.vendorName}</p>
            </div>
          </div>

          {specs.length > 0 && (
            <div>
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-2">Specifications</p>
              <div className="bg-gray-50 border border-gray-100 divide-y divide-gray-100">
                {specs.map(([key, value]) => (
                  <div key={key} className="flex justify-between px-3 py-1.5 text-[11px]">
                    <span className="text-gray-500 font-mono">{key}</span>
                    <span className="text-gray-800 font-semibold font-mono text-right max-w-[60%] truncate">{value}</span>
                  </div>
                ))}
              </div>
              {hasMoreSpecs && (
                <button
                  onClick={() => { onClose(); onViewDetails(product.id); }}
                  className="text-[10px] font-mono font-bold text-[#3373AB] hover:text-[#255C8E] mt-1.5"
                >
                  [view more specs →]
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-4 py-2">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-9 h-9 border border-gray-300 text-gray-600 font-bold text-lg hover:bg-gray-100 outline-none"
            >
              −
            </button>
            <span className="w-16 text-center text-lg font-bold font-mono text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(q + 1, product.stock))}
              className="w-9 h-9 border border-gray-300 text-gray-600 font-bold text-lg hover:bg-gray-100 outline-none"
            >
              +
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 px-4 py-3 space-y-1 text-center">
            <p className="text-[11px] font-mono text-gray-500">
              Unit Price: <span className="font-bold text-gray-800">RWF {product.price.toFixed(2)}</span>
            </p>
            <p className="text-base font-bold font-mono text-gray-900">
              Total: RWF {(product.price * quantity).toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2 text-xs uppercase tracking-wider outline-none"
            >
              Cancel
            </button>
            <button
              onClick={() => { onAddToCart(product, quantity); onClose(); }}
              className="flex-1 bg-[#3373AB] hover:bg-[#255C8E] text-white font-bold py-2 text-xs uppercase tracking-wider outline-none transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-cart-arrow-down" style={{fontSize:'11px'}}></i>
              <span>Update Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
