import {
  Router,
} from "express";

import bcrypt from "bcryptjs";

import {
  users,
} from "../data/mock-db";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  requireRole,
} from "../middleware/role.middleware";

const router =
  Router();

router.use(
  authenticate
);

/*
 * GET /api/users
 *
 * Solo ADMIN.
 */
router.get(
  "/",

  requireRole(
    "ADMIN"
  ),

  (
    request,
    response
  ) => {

    const safeUsers =
      users.map(
        (user) => ({

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
        })
      );

    response.json(
      safeUsers
    );
  }
);

/*
 * POST /api/users
 */
router.post(
  "/",

  requireRole(
    "ADMIN"
  ),

  (
    request,
    response
  ) => {

    const {
      name,
      username,
      password,
      role,
    } =
      request.body;

    if (
      !name ||
      !username ||
      !password ||
      !role
    ) {

      response
        .status(400)
        .json({
          message:
            "Complete todos los campos.",
        });

      return;
    }

    const exists =
      users.some(
        (user) =>
          user.username ===
          username
      );

    if (exists) {

      response
        .status(409)
        .json({
          message:
            "El nombre de usuario ya existe.",
        });

      return;
    }

    if (
      ![
        "ADMIN",
        "ADMISIONES",
        "CONSULTA",
      ].includes(
        role
      )
    ) {

      response
        .status(400)
        .json({
          message:
            "Rol inválido.",
        });

      return;
    }

    const newUser = {

      id:
        `USR-${Date.now()}`,

      name,

      username,

      passwordHash:
        bcrypt.hashSync(
          password,
          10
        ),

      role,

      active:
        true,
    };

    users.push(
      newUser
    );

    response
      .status(201)
      .json({

        id:
          newUser.id,

        name:
          newUser.name,

        username:
          newUser.username,

        role:
          newUser.role,

        active:
          newUser.active,
      });
  }
);

export default router;