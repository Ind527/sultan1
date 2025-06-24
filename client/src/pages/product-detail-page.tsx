import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FloatingWhatsApp from "@/components/ui/floating-whatsapp";
import QuoteRequestModal from "@/components/quote/quote-request-modal";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import ProductCard from "@/components/product/product-card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { 
  Star, 
  Eye, 
  Share2, 
  Heart, 
  ShoppingCart,
  Truck,
  Shield,
  Award
} from "lucide-react";

import { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const queryClient = useQueryClient();

  // Fetch product details
  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["/api/products/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found");
        }
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!slug
  });

  // Fetch related products
  const { data: relatedProducts, isLoading: relatedLoading } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products", { categoryId: product?.categoryId, limit: 4 }],
    queryFn: async () => {
      const params = new URLSearchParams({
        categoryId: product!.categoryId!.toString(),
        limit: "4",
        isActive: "true"
      });
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch related products");
      return response.json();
    },
    enabled: !!product?.categoryId
  });

  // Wishlist mutation (placeholder for future implementation)
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      // TODO: Implement wishlist API
      console.log("Added to wishlist:", productId);
    },
    onSuccess: () => {
      // TODO: Show success toast
    }
  });

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <LoadingSkeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <LoadingSkeleton className="h-8 w-3/4" />
              <LoadingSkeleton className="h-4 w-1/2" />
              <LoadingSkeleton className="h-24 w-full" />
              <LoadingSkeleton className="h-12 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/products">Browse Products</a>
          </Button>
        </div>
      </div>
    );
  }

  const images = product?.images?.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <FloatingWhatsApp />

      {/* Product Details Section */}
      <motion.section 
        className="py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-muted">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
                {product.isFeatured && (
                  <Badge className="absolute top-4 left-4">
                    Featured
                  </Badge>
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => addToWishlistMutation.mutate(product.id)}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Premium Quality</Badge>
                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{product.viewCount} views</span>
                  </div>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
                
                {product.shortDescription && (
                  <p className="text-xl text-muted-foreground mb-4">
                    {product.shortDescription}
                  </p>
                )}
              </div>

              {/* Product Specifications */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.volume && (
                      <div>
                        <span className="text-muted-foreground text-sm">Volume</span>
                        <p className="font-medium">{product.volume}</p>
                      </div>
                    )}
                    {product.weight && (
                      <div>
                        <span className="text-muted-foreground text-sm">Weight</span>
                        <p className="font-medium">{product.weight}</p>
                      </div>
                    )}
                    {product.brixLevel && (
                      <div>
                        <span className="text-muted-foreground text-sm">Brix Level</span>
                        <p className="font-medium">{product.brixLevel}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground text-sm">Price</span>
                      <p className="font-medium text-primary">{product.price}</p>
                    </div>
                  </div>
                  
                  {/* Additional Specifications */}
                  {product?.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground text-sm">{key}</span>
                            <p className="font-medium">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full text-lg"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Request Quote
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="lg">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => addToWishlistMutation.mutate(product.id)}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Wishlist
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Quality Assured</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Global Shipping</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Certified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Product Description</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.products.length > 0 && (
        <motion.section 
          className="py-16 bg-muted/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Related Products</h2>
            
            {relatedLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <LoadingSkeleton key={i} className="h-80" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.products
                  .filter(p => p.id !== product.id)
                  .slice(0, 4)
                  .map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      product={relatedProduct}
                      onQuoteRequest={() => setIsQuoteModalOpen(true)}
                    />
                  ))}
              </div>
            )}
          </div>
        </motion.section>
      )}

      <Footer />
      
      <QuoteRequestModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)}
        preSelectedProduct={product.name}
      />
    </div>
  );
}
