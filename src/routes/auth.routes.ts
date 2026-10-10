import {
  Router,
} from "express";

import bcrypt from "bcryptjs";

import {
  users,
} from "../data/mock-db";

import {
  loginSchema,
} from "../schemas/auth.schema";

import {
  createToken,
} from "../utils/jwt";

import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router =
  Router();

/*
 * POST /api/auth/login
 */
router.post(
  "/login",

  async (
    request,
    response
  ) => {

    const validation =
      loginSchema.safeParse(
        request.body
      );

    if (
      !validation.success
    ) {

      response
        .status(400)
        .json({
          message:
            "Datos inválidos.",

          errors:
            validation.error.flatten(),
        });

      return;
    }

    const {
      username,
      password,
    } =
      validation.data;

    const user =
      users.find(
        (item) =>
          item.username ===
          username
      );

    if (
      !user ||
      !user.active
    ) {

      response
        .status(401)
        .json({
          message:
            "Usuario o contraseña incorrectos.",
        });

      return;
    }

    const passwordOk =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordOk) {

      response
        .status(401)
        .json({
          message:
            "Usuario o contraseña incorrectos.",
        });

      return;
    }

    const token =
      createToken({
        userId:
          user.id,

        username:
          user.username,

        role:
          user.role,
      });

    response.json({

      message:
        "Inicio de sesión exitoso.",

      token,

      user: {
        id:
          user.id,

        name:
          user.name,

        username:
          user.username,

        role:
          user.role,
      },
    });
  }
);

/*
 * GET /api/auth/me
 */
router.get(
  "/me",

  authenticate,

  (
    request:
      AuthenticatedRequest,

    response
  ) => {

    const user =
      users.find(
        (item) =>
          item.id ===
          request.user?.id
      );

    if (!user) {

      response
        .status(404)
        .json({
          message:
            "Usuario no encontrado.",
        });

      return;
    }

    response.json({
      id:
        user.id,

      name:
        user.name,

      username:
        user.username,

      role:
        user.role,

      active:
        user.active,
    });
  }
);

export default router;