import bcrypt from "bcryptjs";

import {
  Admission,
  Patient,
  User,
} from "../types";

export const users: User[] = [
  {
    id: "USR-001",

    name:
      "Administrador CAIMI",

    username:
      "admin",

    passwordHash:
      bcrypt.hashSync(
        "admin123",
        10
      ),

    role:
      "ADMIN",

    active:
      true,
  },

  {
    id: "USR-002",

    name:
      "Ana López",

    username:
      "alopez",

    passwordHash:
      bcrypt.hashSync(
        "admisiones123",
        10
      ),

    role:
      "ADMISIONES",

    active:
      true,
  },

  {
    id: "USR-003",

    name:
      "Carlos Choc",

    username:
      "cchoc",

    passwordHash:
      bcrypt.hashSync(
        "consulta123",
        10
      ),

    role:
      "CONSULTA",

    active:
      true,
  },
];

export const patients: Patient[] = [
  {
    id:
      "PAT-001",

    cui:
      "2356489011603",

    expediente:
      "EXP-2026-001",

    firstName:
      "María",

    secondName:
      "Elena",

    firstSurname:
      "Caal",

    secondSurname:
      "Pop",

    birthDate:
      "1998-07-18",

    sex:
      "Femenino",

    phone:
      "5555-1234",

    department:
      "Alta Verapaz",

    municipality:
      "San Cristóbal Verapaz",

    community:
      "Chiyuc",

    address:
      "San Cristóbal Verapaz, Alta Verapaz",

    createdAt:
      "2026-09-01T08:00:00.000Z",

    updatedAt:
      "2026-09-01T08:00:00.000Z",
  },

  {
    id:
      "PAT-002",

    cui:
      "2345678901603",

    expediente:
      "EXP-2026-002",

    firstName:
      "Juan",

    firstSurname:
      "Choc",

    secondSurname:
      "Caal",

    birthDate:
      "1987-03-11",

    sex:
      "Masculino",

    phone:
      "5555-3333",

    department:
      "Alta Verapaz",

    municipality:
      "Cobán",

    address:
      "Cobán, Alta Verapaz",

    createdAt:
      "2026-09-05T08:00:00.000Z",

    updatedAt:
      "2026-09-05T08:00:00.000Z",
  },

  {
    id:
      "PAT-003",

    cui:
      "2456789011603",

    expediente:
      "EXP-2026-003",

    firstName:
      "Rosa",

    firstSurname:
      "Pop",

    secondSurname:
      "Tzul",

    birthDate:
      "2001-11-20",

    sex:
      "Femenino",

    department:
      "Alta Verapaz",

    municipality:
      "San Cristóbal Verapaz",

    createdAt:
      "2026-09-07T08:00:00.000Z",

    updatedAt:
      "2026-09-07T08:00:00.000Z",
  },
];

export const admissions: Admission[] = [
  {
    id:
      "ADM-001",

    patientId:
      "PAT-001",

    date:
      "2026-10-01T08:30:00.000Z",

    service:
      "Emergencia",

    area:
      "Materno Infantil",

    reason:
      "Ingreso para atención",

    observations:
      "",

    responsibleUserId:
      "USR-002",
  },

  {
    id:
      "ADM-002",

    patientId:
      "PAT-001",

    date:
      "2026-06-14T10:15:00.000Z",

    service:
      "Consulta externa",

    area:
      "Consulta",

    reason:
      "Consulta general",

    observations:
      "",

    responsibleUserId:
      "USR-002",
  },

  {
    id:
      "ADM-003",

    patientId:
      "PAT-002",

    date:
      "2026-09-17T14:20:00.000Z",

    service:
      "Consulta externa",

    area:
      "Medicina general",

    reason:
      "Atención general",

    observations:
      "",

    responsibleUserId:
      "USR-002",
  },
];