import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axiosClient from "@/lib/axios-client";

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useFetch<T = any>(url: string, passToken: boolean = false): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers: Record<string, string> = { "Content-Type": "application/json" };

        if (passToken) {
          const token = await getToken();
          console.log("token", token)
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }

        const response = await axiosClient.get<T>(url, { headers });
        console.log("Response", response.data);
        setData(response.data);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, passToken, getToken]);

  return { data, error, loading };
}
