import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Users, 
  Award, 
  Globe, 
  Truck,
  Phone,
  Mail,
  MapPin,
  Leaf, 
  ShieldCheck, 
  Star,
  TrendingUp
} from "lucide-react";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FloatingWhatsApp from "@/components/ui/floating-whatsapp";
import QuoteRequestModal from "@/components/quote/quote-request-modal";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { Product } from "@shared/schema";
import { useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const { data: featuredProducts, isLoading } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products", { isFeatured: true, limit: 6 }],
    queryFn: async () => {
      const params = new URLSearchParams({
        isFeatured: "true",
        limit: "6"
      });
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch featured products");
      return response.json();
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <motion.section 
        className="pt-8 pb-16 bg-gradient-to-br from-primary/5 via-primary/10 to-background"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 text-sm px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Global Export Leader
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Premium <span className="text-primary">Agricultural</span> Exports Worldwide
              </h1>
              <p className="text-xl mb-8 text-muted-foreground leading-relaxed">
                Connecting global markets with the finest quality agricultural products. From fresh produce to processed goods, we deliver excellence across continents.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-4 hover-scale" asChild>
                  <Link to="/products">
                    <Leaf className="w-5 h-5 mr-2" />
                    Browse Products
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Get Quote
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Fresh agricultural products and farming landscape" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">Countries</div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
            variants={staggerContainer}
          >
            {[
              { value: "50+", label: "Countries Served", icon: Globe },
              { value: "200+", label: "Premium Products", icon: Leaf },
              { value: "15+", label: "Years Excellence", icon: TrendingUp },
              { value: "99%", label: "Client Satisfaction", icon: Star }
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                    <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our most popular export products trusted by clients worldwide
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} className="h-80" />
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {featuredProducts?.products.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <Card className="product-card group overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img 
                        src={product.images?.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4">
                        Featured
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Premium Quality
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">{product.rating || "4.9"}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
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
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm" asChild>
                          <Link to={`/products/${product.slug}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsQuoteModalOpen(true)}
                        >
                          Quote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose GlobalExport</h2>
            <p className="text-xl text-muted-foreground">
              Our commitment to quality and excellence sets us apart
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: ShieldCheck,
                title: "Quality Assurance",
                description: "ISO certified processes and international standards compliance ensuring premium quality products."
              },
              {
                icon: Truck,
                title: "Global Logistics",
                description: "Efficient shipping and delivery network covering 50+ countries with reliable tracking systems."
              },
              {
                icon: Leaf,
                title: "Sustainable Practices",
                description: "Environmentally responsible farming and packaging methods supporting sustainable agriculture."
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Start Your Export Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Contact us today for personalized service and competitive pricing on premium agricultural products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 py-4"
                onClick={() => setIsQuoteModalOpen(true)}
              >
                Request Quote Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                <Link to="/products">
                  Browse Catalog
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to start your export journey? Contact us today for personalized service and competitive pricing.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">info@globalexport.com</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-muted-foreground">123 Export Street, Trade City, TC 12345</p>
            </div>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              <Phone className="w-5 h-5 mr-2" />
              Request Quote Now
            </Button>
          </motion.div>
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