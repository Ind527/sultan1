import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FloatingWhatsApp from "@/components/ui/floating-whatsapp";
import ProductGrid from "@/components/product/product-grid";
import CategorySidebar from "@/components/product/category-sidebar";
import QuoteRequestModal from "@/components/quote/quote-request-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Product, Category } from "@shared/schema";

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ProductsPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["/api/products", {
      search: searchQuery,
      categoryId: selectedCategory,
      page: currentPage,
      sortBy,
      sortOrder,
      isActive: true
    }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        sortBy,
        sortOrder,
        isActive: "true"
      });
      
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory) params.append("categoryId", selectedCategory);
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    }
  });

  // Search suggestions
  const { data: suggestions } = useQuery<Array<{ id: number; name: string; slug: string }>>({
    queryKey: ["/api/search/suggestions", { q: searchQuery }],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      return response.json();
    },
    enabled: searchQuery.length >= 2
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? "" : categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (slug: string) => {
    setLocation(`/products/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <motion.section 
        className="py-16 bg-gradient-to-br from-primary/5 to-background"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Premium Products</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our extensive catalog of high-quality agricultural products, carefully selected and processed to meet international standards.
            </p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="bg-card rounded-xl p-6 shadow-lg border">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                
                {/* Search Suggestions */}
                {suggestions && suggestions.length > 0 && searchQuery.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="w-full text-left px-4 py-2 hover:bg-accent text-sm"
                        onClick={() => handleProductClick(suggestion.slug)}
                      >
                        {suggestion.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Category Filter */}
              <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sort Options */}
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  <SelectItem value="viewCount-desc">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Active Filters */}
            {(searchQuery || selectedCategory) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSearch("")}
                    className="h-7 px-2 text-xs"
                  >
                    Search: "{searchQuery}" ×
                  </Button>
                )}
                {selectedCategory && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCategoryChange("all")}
                    className="h-7 px-2 text-xs"
                  >
                    Category: {categories?.find(c => c.id.toString() === selectedCategory)?.name} ×
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <CategorySidebar
                categories={categories || []}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                productsCount={productsData?.total || 0}
              />
            </div>
            
            {/* Products Grid */}
            <div className="lg:col-span-4">
              <ProductGrid
                products={productsData?.products || []}
                isLoading={isLoading}
                total={productsData?.total || 0}
                currentPage={currentPage}
                totalPages={productsData?.totalPages || 1}
                onPageChange={handlePageChange}
                onProductClick={handleProductClick}
                onQuoteRequest={() => setIsQuoteModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <QuoteRequestModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </div>
  );
}
