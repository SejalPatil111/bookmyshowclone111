import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Booking {
  id: string;
  user_id: string;
  movie_id: string;
  show_time: string;
  show_date: string;
  seats: number;
  total_amount: number;
  status: "pending" | "confirmed" | "paid" | "cancelled";
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  movie_id: string;
  show_time: string;
  show_date: string;
  seats: number;
  total_amount: number;
}

export const useBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          ...bookingData,
          user_id: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
      paymentId,
    }: {
      bookingId: string;
      status: "pending" | "confirmed" | "paid" | "cancelled";
      paymentId?: string;
    }) => {
      const updateData: Partial<Booking> = { status };
      if (paymentId) {
        updateData.payment_id = paymentId;
      }

      const { data, error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

// Mock email notification function
export const sendBookingConfirmationEmail = (booking: Booking, movieTitle: string) => {
  // Simulate email sending with a toast notification
  toast({
    title: "📧 Confirmation Email Sent!",
    description: `A confirmation email for "${movieTitle}" has been sent to your email address.`,
  });
};

// Mock payment function
export const processMockPayment = async (amount: number): Promise<string> => {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Generate a mock payment ID
  const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return paymentId;
};
