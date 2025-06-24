import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Filter, X } from "lucide-react";
import { Category } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  productsCount: number;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  productsCount
}: CategorySidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      onCategoryChange("");
    } else {
      onCategoryChange(categoryId);
    }
  };

  const clearFilters = () => {
    onCategoryChange("");
    setPriceRange([0, 100]);
  };

  const hasActiveFilters = selectedCategory && selectedCategory !== "";

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {productsCount} products found
      </div>

      {/* Categories */}
      <Card>
        <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Categories</CardTitle>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* All Categories Option */}
                {/* Mobile Categories */}
                <div className="pb-3">
                  <Select value={selectedCategory || "all"} onValueChange={(value) => onCategoryChange(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox 
                      checked={!selectedCategory}
                      onCheckedChange={() => onCategoryChange("")}
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                </div>

                {/* Individual Categories */}
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <Checkbox 
                        checked={selectedCategory === category.id.toString()}
                        onCheckedChange={() => handleCategoryToggle(category.id.toString())}
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      {/* TODO: Add actual product count per category */}
                      {Math.floor(Math.random() * 20) + 5}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Price Range */}
      <Card>
        <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Price Range (USD/kg)</CardTitle>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${isPriceOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1] === 100 ? '100+' : priceRange[1]}</span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Featured Products Filter */}
      <Card>
        <CardContent className="p-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <Checkbox />
            <span className="text-sm">Featured Products Only</span>
          </label>
        </CardContent>
      </Card>

      {/* Quality Badges */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quality Certifications</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <Checkbox />
              <span className="text-sm">ISO Certified</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <Checkbox />
              <span className="text-sm">Organic</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <Checkbox />
              <span className="text-sm">Fair Trade</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <Checkbox />
              <span className="text-sm">Export Quality</span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button 
          variant="outline" 
          onClick={() => setIsMobileOpen(true)}
          className="w-full"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              !
            </Badge>
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-80 bg-background z-50 overflow-y-auto lg:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}