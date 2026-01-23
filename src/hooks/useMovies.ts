import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Movie {
  id: string;
  title: string;
  poster: string | null;
  backdrop: string | null;
  rating: number | null;
  genre: string[];
  duration: string | null;
  release_date: string | null;
  language: string | null;
  description: string | null;
  featured: boolean | null;
  available_seats: number | null;
  price: number | null;
  show_times: string[];
  is_available: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useMovies = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useFeaturedMovie = () => {
  return useQuery({
    queryKey: ["featured-movie"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("featured", true)
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Movie | null;
    },
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Movie;
    },
    enabled: !!id,
  });
};
