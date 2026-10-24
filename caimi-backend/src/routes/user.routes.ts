import {
  Router,
} from "express";

import bcrypt from "bcryptjs";

import {
  randomUUID,
} from "crypto";

import {
  db,
} from "../database/db";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  requireRole,
} from "../middleware/role.middleware";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router =
  Router();


router.use(
  authenticate
);


router.get(
  "/",

  requireRole(
    "ADMIN"
  ),

  async (
    request,
    response
  ) => {

    try {

      const result =
        await db.query(`
          SELECT

            id,

            name,

            username,

            role,

            active,

            created_at
              AS "createdAt"

          FROM users

          ORDER BY
            name ASC;
      `);


      response.json(
        result.rows
      );

    } catch (error) {

      console.error(
        error
      );

      response
        .status(500)
        .json({
          message:
            "Error consultando usuarios.",
        });
    }
  }
);


router.post(
  "/",

  requireRole(
    "ADMIN"
  ),

  async (
    request,
    response
  ) => {

    try {

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


      const existing =
        await db.query(
          `
          SELECT id
          FROM users
          WHERE username = $1;
          `,

          [
            username,
          ]
        );


      if (
        existing.rows.length >
        0
      ) {

        response
          .status(409)
          .json({
            message:
              "El nombre de usuario ya existe.",
          });

        return;
      }


      const passwordHash =
        await bcrypt.hash(
          password,
          10
        );


      const result =
        await db.query(
          `
          INSERT INTO users (

            id,

            name,

            username,

            password_hash,

            role,

            active

          )

          VALUES (

            $1,

            $2,

            $3,

            $4,

            $5,

            TRUE

          )

          RETURNING

            id,

            name,

            username,

            role,

            active;
          `,

          [

            randomUUID(),

            name,

            username,

            passwordHash,

            role,
          ]
        );


      response
        .status(201)
        .json(
          result.rows[0]
        );

    } catch (error) {

      console.error(
        error
      );

      response
        .status(500)
        .json({
          message:
            "No fue posible crear el usuario.",
        });
    }
  }
);

router.patch(
  "/:id/status",

  requireRole(
    "ADMIN"
  ),

  async (
    request:
      AuthenticatedRequest,

    response
  ) => {

    try {

      const {
        active,
      } =
        request.body;

      if (
        typeof active !==
        "boolean"
      ) {

        response
          .status(400)
          .json({
            message:
              "El estado debe ser verdadero o falso.",
          });

        return;
      }

      /*
       * Impedir que el administrador
       * desactive su propia cuenta.
       */
      if (
        request.user?.id ===
          request.params.id &&
        active === false
      ) {

        response
          .status(400)
          .json({
            message:
              "No puede desactivar su propia cuenta.",
          });

        return;
      }

      const result =
        await db.query(
          `
          UPDATE users

          SET
            active = $2,
            updated_at = NOW()

          WHERE id = $1

          RETURNING

            id,
            name,
            username,
            role,
            active;
          `,
          [
            request.params.id,
            active,
          ]
        );

      if (
        result.rows.length ===
        0
      ) {

        response
          .status(404)
          .json({
            message:
              "Usuario no encontrado.",
          });

        return;
      }

      response.json(
        result.rows[0]
      );

    } catch (error) {

      console.error(
        error
      );

      response
        .status(500)
        .json({
          message:
            "No fue posible modificar el usuario.",
        });
    }
  }
);

export default router;