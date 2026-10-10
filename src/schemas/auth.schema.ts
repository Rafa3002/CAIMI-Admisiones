import {
  z,
} from "zod";

export const loginSchema =
  z.object({

    username:
      z.string()
        .trim()
        .min(
          3,
          "El usuario es obligatorio"
        ),

    password:
      z.string()
        .min(
          6,
          "La contraseña es obligatoria"
        ),
  });