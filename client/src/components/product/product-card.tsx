import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Eye } from "lucide-react";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onQuoteRequest: () => void;
}

export default function ProductCard({ product, onQuoteRequest }: ProductCardProps) {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="product-card group overflow-hidden h-full">
        <div className="relative overflow-hidden">
          <img 
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {product.isFeatured && (
              <Badge className="bg-primary/90 text-primary-foreground">
                Featured
              </Badge>
            )}
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              Premium
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              Export Quality
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {product.rating || "4.9"}
              </span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 flex-shrink-0">
            {product.name}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
            {product.shortDescription || product.description}
          </p>
          
          <div className="space-y-2 mb-4">
            {product.volume && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-medium">{product.volume}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Weight:</span>
                <span className="font-medium">{product.weight}</span>
              </div>
            )}
            {product.viewCount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  Views:
                </span>
                <span className="font-medium">{product.viewCount}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-auto">
            <Button className="flex-1" size="sm" asChild>
              <Link to={`/products/${product.slug}`}>
                View Details
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onQuoteRequest}
            >
              Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
