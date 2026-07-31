import { create } from 'zustand';
import { Incident, MemoryFix, IncidentSeverity, IncidentStatus } from '@/types/incident';
import { MOCK_INCIDENTS, MOCK_MEMORY_FIXES } from '@/services/mockData';

interface IncidentStore {
  incidents: Incident[];
  memoryFixes: MemoryFix[];
  selectedSeverityFilter: IncidentSeverity | 'ALL';
  selectedStatusFilter: IncidentStatus | 'ALL';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSeverityFilter: (severity: IncidentSeverity | 'ALL') => void;
  setStatusFilter: (status: IncidentStatus | 'ALL') => void;
  resolveIncident: (id: string) => void;
}

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: MOCK_INCIDENTS,
  memoryFixes: MOCK_MEMORY_FIXES,
  selectedSeverityFilter: 'ALL',
  selectedStatusFilter: 'ALL',
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSeverityFilter: (selectedSeverityFilter) => set({ selectedSeverityFilter }),
  setStatusFilter: (selectedStatusFilter) => set({ selectedStatusFilter }),
  resolveIncident: (id) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, status: 'RESOLVED' as IncidentStatus } : inc
      ),
    })),
}));
