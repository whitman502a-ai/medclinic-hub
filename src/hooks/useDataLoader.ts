import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function useDataLoader() {
  const { loaded, loadFromDb } = useStore();

  useEffect(() => {
    if (!loaded) {
      loadFromDb();
    }
  }, [loaded, loadFromDb]);

  return loaded;
}
