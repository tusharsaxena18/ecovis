import React from 'react';
import { Product } from '@shared/schema';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-neutral-900 truncate">{product.name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {product.tag}
          </span>
        </div>
        <p className="mt-1 text-sm text-neutral-500">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-medium text-neutral-900">{product.price}</div>
          <div className="text-sm text-neutral-500">{product.tagline}</div>
        </div>
        <div className="mt-4">
          <button 
            type="button" 
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
