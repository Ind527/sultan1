import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, InsertProduct } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ProductsQueryParams {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
  page?: number;
  sortBy?: "name" | "createdAt" | "rating" | "viewCount";
  sortOrder?: "asc" | "desc";
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useProducts(params?: ProductsQueryParams) {
  return useQuery<ProductsResponse>({
    queryKey: ["/api/products", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params?.search) searchParams.append("search", params.search);
      if (params?.categoryId) searchParams.append("categoryId", params.categoryId.toString());
      if (params?.isActive !== undefined) searchParams.append("isActive", params.isActive.toString());
      if (params?.isFeatured !== undefined) searchParams.append("isFeatured", params.isFeatured.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
      
      const response = await fetch(`/api/products?${searchParams}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    }
  });
}

export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found");
        }
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!id
  });
}

export function useProductBySlug(slug: string) {
  return useQuery<Product>({
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
}

export function useFeaturedProducts(limit: number = 6) {
  return useQuery<ProductsResponse>({
    queryKey: ["/api/products", { isFeatured: true, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        isFeatured: "true",
        limit: limit.toString(),
        isActive: "true"
      });
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch featured products");
      return response.json();
    }
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    }
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProduct> }) => {
      const response = await apiRequest("PUT", `/api/products/${id}`, data);
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id] });
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    }
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery<Array<{ id: number; name: string; slug: string }>>({
    queryKey: ["/api/search/suggestions", { q: query }],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      return response.json();
    },
    enabled: query.length >= 2
  });
}

export function useProductStats() {
  return useQuery({
    queryKey: ["/api/products/stats"],
    queryFn: async () => {
      // This would be a custom endpoint for dashboard stats
      const response = await fetch("/api/products?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch product stats");
      const data = await response.json();
      
      return {
        total: data.total,
        active: data.products.filter((p: Product) => p.isActive).length,
        featured: data.products.filter((p: Product) => p.isFeatured).length,
        totalViews: data.products.reduce((sum: number, p: Product) => sum + (p.viewCount || 0), 0)
      };
    }
  });
}
