import { useState, useEffect, useCallback } from "react";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface FetchResponse<Data> {
  data: Data | null;
  error: Error | null;
  status: FetchStatus;
}

const useFetch = <Data>(
  url: string,
  options?: RequestInit
): FetchResponse<Data> => {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");

  const fetchData = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const responseData: Data = await response.json();
      setData(responseData);
      setStatus("success");
    } catch (error) {
      setError(error);
      setStatus("error");
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, status };
};

export default useFetch;
