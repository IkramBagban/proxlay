import axiosClient from "@/lib/axios-client";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import toast from "react-hot-toast";
const apiUrl = "localhost:3000/api/v1"; // Adjust this to your backend API URL

// Create an event bus for credit updates
export const creditUpdateEvent = new EventTarget();

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handlePayment = async (
    plan: "basic" | "pro",
    p0: boolean,
    p1: string
  ) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        `http://localhost:3000/api/v1/payments/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan, method: "razorpay" }),
        }
      );

      const data = await response.json();
      console.log("Payment data:", data);
      if (!response.ok) throw new Error(data.message || "Payment failed");

      await loadRazorpayScript();

      const options = {
        key: data.key,
        amount: String(data.amount),
        currency: data.currency,
        name: data.name,
        description: data.description,
        subscription_id: data.subscription_id,
        handler: async function (response: any) {
          console.log("Payment response:", response);

          try {
            const verifyPaymentResponse = await axiosClient.post(
              "/payments/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan,
                amount: String(data.amount),
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                
              }
            );

            if (verifyPaymentResponse.status === 200) {
              toast.success("Payment verified successfully");
            } else if (verifyPaymentResponse.status === 400) {
              toast.error(
                "Payment verification failed: " +
                  verifyPaymentResponse.data.message
              );
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log("Payment error:", error);
      alert("Payment Error: " + (error as Error).message);
      //   toast({
      //     title: "Payment Error",
      //     description: "Failed to initialize payment",
      //     variant: "destructive",
      //   });
      toast.error(
        "Payment Error: " + (error as Error).message ||
          "Failed to initialize payment"
      );
      // window.location.href = "/payment/cancel";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handlePayment,
    isLoading,
  };
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}
