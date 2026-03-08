'use client';

import { useState, useCallback } from 'react';

// Simple flag to use mock data instead of API
// Set this to true during development when API is not available
const USE_MOCK_DATA = true;

export function useMockData() {
  const [useMock, setUseMock] = useState(USE_MOCK_DATA);

  const shouldUseMock = useCallback(() => {
    return useMock;
  }, [useMock]);

  return {
    useMock,
    setUseMock,
    shouldUseMock,
    USE_MOCK_DATA,
  };
}

// Export a helper to check if we should use mock data
export const isMockMode = USE_MOCK_DATA;
