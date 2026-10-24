export type Role =
  | "ADMIN"
  | "ADMISIONES"
  | "CONSULTA";

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  active?: boolean;
}

export interface Admission {
  id: string;

  patientId: string;

  date: string;

  service: string;

  area: string;

  reason: string;

  observations?: string | null;

  responsibleUserId?: string;

  responsible?: string;

  expediente?: string;

  patientName?: string;
}

export interface Patient {
  id: string;

  cui?: string | null;

  expediente: string;

  firstName: string;

  secondName?: string | null;

  firstSurname: string;

  secondSurname?: string | null;

  marriedSurname?: string | null;

  birthDate?: string | null;

  sex?: string | null;

  phone?: string | null;

  department?: string | null;

  municipality?: string | null;

  community?: string | null;

  address?: string | null;

  admissionsCount?: number;

  admissions?: Admission[];

  createdAt?: string;

  updatedAt?: string;
}

export interface DashboardSummary {
  totalPatients: number;

  totalAdmissions: number;

  recurrentPatients: number;

  activeServices: number;

  recentPatients: Array<{
    id: string;

    expediente: string;

    firstName: string;

    firstSurname: string;

    municipality?: string;

    admissionsCount: number;
  }>;
}

export interface ReportSummary {
  totalPatients: number;

  totalAdmissions: number;

  recurrentPatients: number;

  byService:
    Record<string, number>;
}