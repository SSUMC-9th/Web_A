import { useState, useEffect } from "react";
import axios from "axios";

function useCustomFetch(url: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        },
      });

      setData(response.data);
    } catch (error) {
      setError("Fail to load data");
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useCustomFetch;
