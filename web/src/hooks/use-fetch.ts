'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseFetchOptions<T> {
  initialData?: T;
  immediate?: boolean;
}

interface UseFetchReturn<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  execute: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { initialData, immediate = true } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}

interface UseMutationOptions<T, TResponse> {
  onSuccess?: (data: TResponse) => void;
  onError?: (error: string) => void;
}

interface UseMutationReturn<T, TResponse> {
  mutate: (data: T) => Promise<void>;
  loading: boolean;
  error: string | null;
  data: TResponse | null;
  reset: () => void;
}

export function useMutation<T, TResponse>(
  mutationFn: (data: T) => Promise<TResponse>,
  options: UseMutationOptions<T, TResponse> = {}
): UseMutationReturn<T, TResponse> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  const mutate = async (data: T) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(data);
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar requisição';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { mutate, loading, error, data, reset };
}
