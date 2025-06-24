import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AdminDashboard from "@/components/admin/admin-dashboard";
import ProductForm from "@/components/admin/product-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  MessageSquare, 
  Users, 
  Settings,
  Plus,
  TrendingUp,
  Eye,
  Clock
} from "lucide-react";

import { Product, Quote, ContactMessage } from "@shared/schema";

export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch dashboard data
  const { data: dashboardData, isError } = useQuery({
    queryKey: ["/api/admin/dashboard"],
    queryFn: async () => {
      try {
        // For now, fetch data separately
        const [productsRes, quotesRes, messagesRes] = await Promise.all([
          fetch("/api/products?limit=5").then(r => r.ok ? r.json() : { products: [], total: 0 }),
          fetch("/api/quotes?limit=5").then(r => r.ok ? r.json() : { quotes: [], total: 0 }),
          fetch("/api/contact-messages?limit=5").then(r => r.ok ? r.json() : { messages: [], total: 0 })
        ]);
        
        return {
          products: productsRes,
          quotes: quotesRes,
          messages: messagesRes,
          stats: {
            totalProducts: productsRes.total || 0,
            totalQuotes: quotesRes.total || 0,
            totalMessages: messagesRes.total || 0,
            activeProducts: productsRes.products?.filter((p: Product) => p.isActive).length || 0
          }
        };
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        return {
          products: { products: [], total: 0 },
          quotes: { quotes: [], total: 0 },
          messages: { messages: [], total: 0 },
          stats: {
            totalProducts: 0,
            totalQuotes: 0,
            totalMessages: 0,
            activeProducts: 0
          }
        };
      }
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  if (showProductForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ProductForm
            product={editingProduct}
            onSave={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <motion.section 
        className="py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.username}! Manage your export business from here.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">
                {user?.role}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{dashboardData?.stats.totalProducts || 0}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Products</p>
                    <p className="text-2xl font-bold">{dashboardData?.stats.activeProducts || 0}</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Quote Requests</p>
                    <p className="text-2xl font-bold">{dashboardData?.stats.totalQuotes || 0}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Messages</p>
                    <p className="text-2xl font-bold">{dashboardData?.stats.totalMessages || 0}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <AdminDashboard data={dashboardData} />
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Products Management</h2>
                <Button onClick={handleAddProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.products.products?.map((product: Product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.images?.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.isActive ? "Active" : "Inactive"} • {product.viewCount} views
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={product.isActive ? "default" : "secondary"}>
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-6">
              <h2 className="text-2xl font-bold">Quote Requests</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Quote Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.quotes.quotes?.map((quote: Quote) => (
                      <div key={quote.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{quote.fullName}</h3>
                          <Badge variant={quote.status === "pending" ? "destructive" : "default"}>
                            {quote.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {quote.email} • {quote.country}
                        </p>
                        <p className="text-sm">{quote.productDetails}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <h2 className="text-2xl font-bold">Contact Messages</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.messages.messages?.map((message: ContactMessage) => (
                      <div key={message.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{message.name}</h3>
                          <Badge variant={message.status === "unread" ? "destructive" : "default"}>
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {message.email} • {message.subject}
                        </p>
                        <p className="text-sm">{message.message}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
