import {
  z,
} from "zod";

export const patientSchema =
  z.object({

    cui:
      z.string()
        .trim()
        .optional(),

    expediente:
      z.string()
        .trim()
        .min(
          1,
          "El expediente es obligatorio"
        ),

    firstName:
      z.string()
        .trim()
        .min(
          2,
          "El primer nombre es obligatorio"
        ),

    secondName:
      z.string()
        .trim()
        .optional(),

    firstSurname:
      z.string()
        .trim()
        .min(
          2,
          "El primer apellido es obligatorio"
        ),

    secondSurname:
      z.string()
        .trim()
        .optional(),

    marriedSurname:
      z.string()
        .trim()
        .optional(),

    birthDate:
      z.string()
        .optional(),

    sex:
      z.string()
        .optional(),

    phone:
      z.string()
        .optional(),

    department:
      z.string()
        .optional(),

    municipality:
      z.string()
        .optional(),

    community:
      z.string()
        .optional(),

    address:
      z.string()
        .optional(),
  });