import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Quote, InsertQuote } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface QuotesQueryParams {
  status?: string;
  page?: number;
  limit?: number;
}

interface QuotesResponse {
  quotes: Quote[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useQuotes(params?: QuotesQueryParams) {
  return useQuery<QuotesResponse>({
    queryKey: ["/api/quotes", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params?.status) searchParams.append("status", params.status);
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      
      const response = await fetch(`/api/quotes?${searchParams}`);
      if (!response.ok) throw new Error("Failed to fetch quotes");
      return response.json();
    }
  });
}

export function useQuote(id: number) {
  return useQuery<Quote>({
    queryKey: ["/api/quotes", id],
    queryFn: async () => {
      const response = await fetch(`/api/quotes/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Quote not found");
        }
        throw new Error("Failed to fetch quote");
      }
      return response.json();
    },
    enabled: !!id
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertQuote) => {
      const response = await apiRequest("POST", "/api/quotes", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
    }
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Quote> }) => {
      const response = await apiRequest("PUT", `/api/quotes/${id}`, data);
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes", id] });
    }
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/quotes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
    }
  });
}

export function useQuoteStats() {
  return useQuery({
    queryKey: ["/api/quotes/stats"],
    queryFn: async () => {
      const response = await fetch("/api/quotes?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch quote stats");
      const data = await response.json();
      
      const quotes = data.quotes as Quote[];
      
      return {
        total: data.total,
        pending: quotes.filter(q => q.status === "pending").length,
        processed: quotes.filter(q => q.status === "processed").length,
        completed: quotes.filter(q => q.status === "completed").length,
        recentCount: quotes.filter(q => {
          const createdAt = new Date(q.createdAt);
          const dayAgo = new Date();
          dayAgo.setDate(dayAgo.getDate() - 1);
          return createdAt > dayAgo;
        }).length
      };
    }
  });
}

// Contact Messages hooks
export function useContactMessages(params?: QuotesQueryParams) {
  return useQuery({
    queryKey: ["/api/contact-messages", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params?.status) searchParams.append("status", params.status);
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      
      const response = await fetch(`/api/contact-messages?${searchParams}`);
      if (!response.ok) throw new Error("Failed to fetch contact messages");
      return response.json();
    }
  });
}

export function useCreateContactMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contact-messages", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    }
  });
}

export function useUpdateContactMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/contact-messages/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    }
  });
}
