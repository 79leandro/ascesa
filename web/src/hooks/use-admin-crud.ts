import { useState, useCallback } from 'react';

interface UseAdminCRUDOptions<T> {
  endpoint: string;
  dataKey?: string;
}

interface UseAdminCRUDReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  create: (data: Partial<T>) => Promise<boolean>;
  update: (id: string, data: Partial<T>) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<boolean>;
}

export function useAdminCRUD<T extends { id: string }>(
  options: UseAdminCRUDOptions<T>
): UseAdminCRUDReturn<T> {
  const { endpoint, dataKey = 'data' } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const result = await res.json();
      if (result.success) {
        setData(result[dataKey] || result[dataKey === 'data' ? 'beneficios' : 'parceiros'] || []);
      } else {
        setError(result.message || 'Erro ao buscar dados');
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, dataKey]);

  const create = useCallback(async (itemData: Partial<T>): Promise<boolean> => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(itemData),
      });
      const result = await res.json();
      if (result.success) {
        await fetchData();
        return true;
      }
      setError(result.message || 'Erro ao criar');
      return false;
    } catch (err) {
      setError('Erro de conexão');
      return false;
    } finally {
      setLoading(false);
    }
  }, [endpoint, fetchData]);

  const update = useCallback(async (id: string, itemData: Partial<T>): Promise<boolean> => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(itemData),
      });
      const result = await res.json();
      if (result.success) {
        await fetchData();
        return true;
      }
      setError(result.message || 'Erro ao atualizar');
      return false;
    } catch (err) {
      setError('Erro de conexão');
      return false;
    } finally {
      setLoading(false);
    }
  }, [endpoint, fetchData]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const result = await res.json();
      if (result.success) {
        await fetchData();
        return true;
      }
      setError(result.message || 'Erro ao excluir');
      return false;
    } catch (err) {
      setError('Erro de conexão');
      return false;
    } finally {
      setLoading(false);
    }
  }, [endpoint, fetchData]);

  const toggleStatus = useCallback(async (id: string): Promise<boolean> => {
    try {
      const token = getToken();
      const res = await fetch(`${endpoint}/${id}/toggle-status`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const result = await res.json();
      if (result.success) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [endpoint, fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    create,
    update,
    remove,
    toggleStatus,
  };
}
