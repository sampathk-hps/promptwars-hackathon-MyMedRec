export type ProviderType = 'Primary Care' | 'Specialist' | 'Urgent Care' | 'Telehealth';

export interface Provider {
  id: string;
  name: string;
  facility: string;
  type: ProviderType;
}

export type Severity = 'low' | 'moderate' | 'high';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  purpose: string;
  prescribedBy: Provider;
  startDate: string;
  endDate?: string;
  duration?: string;
  status: 'active-ongoing' | 'active-short-term' | 'active-as-needed' | 'completed';
  notes?: string;
}

export interface DrugInteraction {
  id: string;
  medication1Id: string;
  medication2Id: string;
  description: string;
  severity: Severity;
  actionRequired: string;
  dateFlagged: string;
}

export interface Visit {
  id: string;
  date: string;
  durationMinutes: number;
  type: ProviderType;
  provider: Provider;
  reason: string;
  summary: string;
  medicationsPrescribed: Medication[];
  followUpActions: string[];
  transcript: { speaker: string; text: string }[];
}

export interface Condition {
  id: string;
  name: string;
  diagnosedDate: string;
  resolvedDate?: string;
  management: string;
  provider: Provider;
  status: 'active' | 'resolved' | 'pending';
}

export interface LabResult {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'borderline';
}

export interface LabPanel {
  id: string;
  name: string;
  dateDrawn: string;
  results: LabResult[];
  orderedBy: Provider;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bloodType: string;
  primaryCareProvider: Provider;
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface CompleteHealthRecord {
  patient: Patient;
  visits: Visit[];
  medications: Medication[];
  conditions: Condition[];
  labPanels: LabPanel[];
  interactions: DrugInteraction[];
}
