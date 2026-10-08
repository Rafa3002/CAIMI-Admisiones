export interface Admission {
  id: string;
  date: string;
  service: string;
  area: string;
  reason: string;
  responsible: string;
}

export interface Patient {
  id: string;
  cui: string;
  expediente: string;

  firstName: string;
  secondName?: string;

  firstSurname: string;
  secondSurname?: string;

  birthDate: string;
  sex: string;

  phone?: string;

  department: string;
  municipality: string;
  community?: string;

  address?: string;

  admissions: Admission[];
}

export const patients: Patient[] = [
  {
    id: "1",

    cui: "2356489011603",
    expediente: "EXP-2026-001",

    firstName: "María",
    secondName: "Elena",

    firstSurname: "Caal",
    secondSurname: "Pop",

    birthDate: "1998-07-18",

    sex: "Femenino",

    phone: "5555-1234",

    department: "Alta Verapaz",
    municipality: "San Cristóbal Verapaz",
    community: "Chiyuc",

    address:
      "San Cristóbal Verapaz, Alta Verapaz",

    admissions: [
      {
        id: "ADM-001",

        date: "2026-10-01 08:30",

        service: "Emergencia",

        area: "Materno Infantil",

        reason:
          "Ingreso para atención",

        responsible:
          "Ana López",
      },

      {
        id: "ADM-002",

        date: "2026-06-14 10:15",

        service: "Consulta externa",

        area: "Consulta",

        reason:
          "Consulta general",

        responsible:
          "Carlos Choc",
      },
    ],
  },

  {
    id: "2",

    cui: "2345678901603",
    expediente: "EXP-2026-002",

    firstName: "Juan",

    firstSurname: "Choc",
    secondSurname: "Caal",

    birthDate: "1987-03-11",

    sex: "Masculino",

    phone: "5555-3333",

    department: "Alta Verapaz",
    municipality: "Cobán",

    address:
      "Cobán, Alta Verapaz",

    admissions: [
      {
        id: "ADM-003",

        date: "2026-09-17 14:20",

        service: "Consulta externa",

        area: "Medicina general",

        reason:
          "Atención general",

        responsible:
          "Ana López",
      },
    ],
  },

  {
    id: "3",

    cui: "2456789011603",
    expediente: "EXP-2026-003",

    firstName: "Rosa",

    firstSurname: "Pop",
    secondSurname: "Tzul",

    birthDate: "2001-11-20",

    sex: "Femenino",

    department: "Alta Verapaz",
    municipality: "San Cristóbal Verapaz",

    admissions: [],
  },
];

export const users = [
  {
    id: "1",
    name: "Administrador CAIMI",
    username: "admin",
    role: "Administrador",
    active: true,
  },

  {
    id: "2",
    name: "Ana López",
    username: "alopez",
    role: "Admisiones",
    active: true,
  },

  {
    id: "3",
    name: "Carlos Choc",
    username: "cchoc",
    role: "Consulta",
    active: true,
  },
];