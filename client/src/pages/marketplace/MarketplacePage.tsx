import React, { useState } from 'react';
import { useAuth } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import ProductCard from '@/components/marketplace/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { 
  Input 
} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, ShoppingBag } from 'lucide-react';

const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [productsPerPage] = useState(6);
  
  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/marketplace/products'],
    queryFn: async () => {
      const response = await fetch(`/api/marketplace/products?limit=100`); // Fetch all for client-side filtering
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });
  
  // Filter products based on search query and category
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    
    return products.filter((product: Product) => {
      const matchesSearch = 
        searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        category === 'all' || 
        product.category.toLowerCase() === category.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, category]);
  
  // Paginate products
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, productsPerPage]);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Handle search
  const handleSearch = () => {
    // Reset to first page when searching
    setPage(1);
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1); // Reset to first page
  };
  
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center justify-between pb-5 border-b border-neutral-200">
          <div>
            <h3 className="text-lg leading-6 font-medium text-neutral-900 font-heading">Eco-Friendly Marketplace</h3>
            <p className="mt-2 max-w-4xl text-sm text-neutral-500">Shop sustainable products and reduce your environmental footprint</p>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-l-md rounded-r-none"
                />
              </div>
              <Button
                type="button"
                onClick={handleSearch}
                className="-ml-px relative rounded-l-none"
                variant="secondary"
              >
                <Search className="h-4 w-4 mr-2" />
                <span>Search</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-end mb-4">
            <Select
              value={category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Kitchen">Kitchen</SelectItem>
                <SelectItem value="Bags">Bags</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Bathroom">Bathroom</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="py-10 text-center">
              <LoadingSpinner />
              <p className="mt-4 text-neutral-500">Loading products...</p>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          className="cursor-pointer"
                          aria-disabled={page === 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Logic to show current page and adjacent pages
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        // Only show if pageNum is valid
                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                isActive={page === pageNum}
                                onClick={() => setPage(pageNum)}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          className="cursor-pointer"
                          aria-disabled={page === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-neutral-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No products found</h3>
              <p className="mt-2 text-neutral-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
