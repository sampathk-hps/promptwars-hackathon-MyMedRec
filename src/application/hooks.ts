import { useState, useEffect } from 'react';
import type { CompleteHealthRecord } from '../domain/types';
import { fetchHealthRecord } from '../infrastructure/data';

// Singleton for naive global state in demo
let cachedRecord: CompleteHealthRecord | null = null;
const listeners = new Set<() => void>();

const loadRecord = async () => {
  if (!cachedRecord) {
    cachedRecord = await fetchHealthRecord();
    listeners.forEach(l => l());
  }
};

loadRecord();

export function useHealthRecord() {
  const [record, setRecord] = useState<CompleteHealthRecord | null>(cachedRecord);
  const [loading, setLoading] = useState(!cachedRecord);

  useEffect(() => {
    const listener = () => {
      setRecord(cachedRecord);
      setLoading(false);
    };
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { record, loading };
}
