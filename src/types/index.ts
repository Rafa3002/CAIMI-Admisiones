export type Role =
  | "ADMIN"
  | "ADMISIONES"
  | "CONSULTA";

export interface User {
  id: string;

  name: string;

  username: string;

  passwordHash: string;

  role: Role;

  active: boolean;
}

export interface Admission {
  id: string;

  patientId: string;

  date: string;

  service: string;

  area: string;

  reason: string;

  observations?: string;

  responsibleUserId: string;
}

export interface Patient {
  id: string;

  cui?: string;

  expediente: string;

  firstName: string;

  secondName?: string;

  firstSurname: string;

  secondSurname?: string;

  marriedSurname?: string;

  birthDate?: string;

  sex?: string;

  phone?: string;

  department?: string;

  municipality?: string;

  community?: string;

  address?: string;

  createdAt: string;

  updatedAt: string;
}