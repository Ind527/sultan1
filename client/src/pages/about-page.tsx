
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  TrendingUp,
  Target,
  Heart,
  CheckCircle,
  Factory,
  Handshake
} from "lucide-react";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FloatingWhatsApp from "@/components/ui/floating-whatsapp";
import QuoteRequestModal from "@/components/quote/quote-request-modal";
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

export default function AboutPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

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
          <motion.div className="text-center max-w-4xl mx-auto" variants={fadeInUp}>
            <Badge className="mb-6 text-sm px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              About GlobalExport
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Connecting <span className="text-primary">Global Markets</span> with Premium Agriculture
            </h1>
            <p className="text-xl mb-8 text-muted-foreground leading-relaxed">
              For over 15 years, we've been the trusted bridge between the world's finest agricultural producers and international markets, delivering excellence across continents.
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto"
            variants={fadeInUp}
          >
            <img 
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
              alt="Global export operations and agricultural facilities" 
              className="w-full h-96 object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Company Story Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Founded in 2008, GlobalExport began as a small family business with a simple mission: to share the world's finest agricultural products with global markets. What started as a local initiative has grown into an international enterprise serving over 50 countries.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our journey has been built on trust, quality, and the relationships we've cultivated with farmers, suppliers, and clients worldwide. Every product we export carries with it our commitment to excellence and sustainability.
              </p>
              <div className="space-y-3">
                {[
                  "15+ years of export experience",
                  "50+ countries served globally", 
                  "200+ premium products in catalog",
                  "99% client satisfaction rate"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Modern agricultural facility and operations" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">2008</div>
                <div className="text-sm">Founded</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Guided by our core principles, we strive to make a positive impact on global trade and agriculture
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To connect global markets with premium agricultural products while supporting sustainable farming practices and fostering long-term partnerships.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the world's most trusted agricultural export company, setting the standard for quality, sustainability, and customer satisfaction.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Our Values</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Integrity, quality excellence, environmental responsibility, and building lasting relationships with all our stakeholders worldwide.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From farm to global market, we manage every step of the export process with precision and care
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Leaf,
                title: "Product Sourcing",
                description: "We work directly with certified farmers and producers to source the highest quality agricultural products."
              },
              {
                icon: ShieldCheck,
                title: "Quality Control",
                description: "Rigorous testing and certification processes ensure every product meets international standards."
              },
              {
                icon: Factory,
                title: "Processing & Packaging",
                description: "State-of-the-art facilities handle processing, packaging, and preparation for international shipping."
              },
              {
                icon: Globe,
                title: "Global Distribution",
                description: "Comprehensive logistics network ensures timely delivery to 50+ countries worldwide."
              }
            ].map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/30">
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
              Our expertise and commitment set us apart in the global export industry
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Award,
                title: "Industry Expertise",
                description: "15+ years of experience in agricultural export with deep market knowledge and industry connections."
              },
              {
                icon: Handshake,
                title: "Trusted Partnerships",
                description: "Long-standing relationships with farmers, suppliers, and distributors ensure consistent quality and supply."
              },
              {
                icon: Truck,
                title: "Reliable Logistics",
                description: "Advanced supply chain management and partnerships with leading shipping companies for on-time delivery."
              },
              {
                icon: ShieldCheck,
                title: "Quality Assurance",
                description: "ISO certified processes and comprehensive quality control at every stage of the export process."
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Extensive network covering 50+ countries with local market knowledge and regulatory compliance."
              },
              {
                icon: Leaf,
                title: "Sustainability Focus",
                description: "Committed to environmentally responsible practices and supporting sustainable agriculture initiatives."
              }
            ].map((advantage, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <advantage.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{advantage.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { value: "50+", label: "Countries Served", icon: Globe },
              { value: "200+", label: "Premium Products", icon: Leaf },
              { value: "15+", label: "Years Excellence", icon: TrendingUp },
              { value: "1000+", label: "Happy Clients", icon: Users }
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-4 opacity-80" />
                  <div className="text-3xl lg:text-4xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <p className="opacity-90">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Partner with Us?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of satisfied clients worldwide. Let's discuss how we can meet your agricultural export needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => setIsQuoteModalOpen(true)}
              >
                <Phone className="w-5 h-5 mr-2" />
                Get Quote Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                <Link to="/products">
                  <Leaf className="w-5 h-5 mr-2" />
                  View Products
                </Link>
              </Button>
            </div>
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
