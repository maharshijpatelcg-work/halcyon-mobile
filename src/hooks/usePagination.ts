/**
 * Halcyon — usePagination Hook
 */
import { useState, useCallback } from 'react';

export function usePagination(pageSize = 10) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const resetPage = useCallback(() => {
    setPage(1);
    setHasMore(true);
  }, []);

  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  }, [hasMore]);

  return {
    page,
    pageSize,
    hasMore,
    setHasMore,
    resetPage,
    nextPage,
  };
}
