import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle } from "lucide-react";

import { insertQuoteSchema, type InsertQuote } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedProduct?: string;
}

const countries = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "JP", label: "Japan" },
  { value: "AU", label: "Australia" },
  { value: "CA", label: "Canada" },
  { value: "FR", label: "France" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "NL", label: "Netherlands" },
  { value: "SG", label: "Singapore" },
  { value: "KR", label: "South Korea" },
  { value: "MY", label: "Malaysia" },
  { value: "TH", label: "Thailand" },
  { value: "IN", label: "India" }
];

const productCategories = [
  { value: "fruits", label: "Fresh Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "spices", label: "Spices & Herbs" },
  { value: "grains", label: "Grains & Cereals" },
  { value: "processed", label: "Processed Products" }
];

export default function QuoteRequestModal({ 
  isOpen, 
  onClose, 
  preSelectedProduct 
}: QuoteRequestModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertQuote>({
    resolver: zodResolver(insertQuoteSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      phone: "",
      country: "",
      productCategory: "",
      productDetails: preSelectedProduct ? `Interested in: ${preSelectedProduct}` : "",
      estimatedQuantity: "",
      deliveryPort: "",
    },
  });

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: InsertQuote) => {
      const response = await apiRequest("POST", "/api/quotes", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Quote request submitted!",
        description: "We'll get back to you within 24 hours.",
      });
      // Reset form after a delay
      setTimeout(() => {
        form.reset();
        setIsSubmitted(false);
        onClose();
      }, 3000);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit quote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertQuote) => {
    submitQuoteMutation.mutate(data);
  };

  const handleClose = () => {
    if (!submitQuoteMutation.isPending) {
      form.reset();
      setIsSubmitted(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request Quote</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you with a personalized quote within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quote Request Submitted!</h3>
              <p className="text-muted-foreground mb-4">
                Thank you for your interest. Our team will review your request and get back to you within 24 hours.
              </p>
              <p className="text-sm text-muted-foreground">
                This window will close automatically...
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...form.register("fullName")}
                    placeholder="Enter your full name"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    {...form.register("company")}
                    placeholder="Your company name"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="your.email@company.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Location and Category */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("country", value)}
                    value={form.watch("country")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.country && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.country.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Product Category</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("productCategory", value)}
                    value={form.watch("productCategory")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-2">
                <Label htmlFor="productDetails">Product Details *</Label>
                <Textarea
                  id="productDetails"
                  {...form.register("productDetails")}
                  rows={4}
                  placeholder="Please specify the products you're interested in, quality requirements, and any special specifications..."
                />
                {form.formState.errors.productDetails && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.productDetails.message}
                  </p>
                )}
              </div>

              {/* Quantity and Delivery */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedQuantity">Estimated Quantity</Label>
                  <Input
                    id="estimatedQuantity"
                    {...form.register("estimatedQuantity")}
                    placeholder="e.g., 10 tons/month"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryPort">Delivery Port</Label>
                  <Input
                    id="deliveryPort"
                    {...form.register("deliveryPort")}
                    placeholder="Destination port or city"
                  />
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" required />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    privacy policy
                  </a>
                  . I consent to being contacted about this quote request.
                </Label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={submitQuoteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitQuoteMutation.isPending}
                  className="min-w-32"
                >
                  {submitQuoteMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
