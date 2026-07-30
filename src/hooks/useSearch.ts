/**
 * Halcyon — useSearch Hook
 */
import { useState, useEffect } from 'react';

export function useSearch(initialQuery = '', delayMs = 300) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delayMs]);

  return {
    query,
    debouncedQuery,
    setQuery,
    clearQuery: () => setQuery(''),
  };
}
