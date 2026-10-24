import {
  z,
} from "zod";

export const admissionSchema =
  z.object({

    patientId:
      z.string()
        .min(1),

    date:
      z.string()
        .min(
          1,
          "La fecha es obligatoria"
        ),

    service:
      z.string()
        .trim()
        .min(
          2,
          "El servicio es obligatorio"
        ),

    area:
      z.string()
        .trim()
        .min(
          1,
          "El área es obligatoria"
        ),

    reason:
      z.string()
        .trim()
        .min(
          3,
          "El motivo es obligatorio"
        ),

    observations:
      z.string()
        .optional(),
  });