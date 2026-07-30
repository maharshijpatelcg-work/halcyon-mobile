/**
 * Halcyon — usePullToRefresh Hook
 */
import { useState, useCallback } from 'react';

export function usePullToRefresh(onRefreshCallback: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefreshCallback();
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshCallback]);

  return { refreshing, onRefresh };
}
