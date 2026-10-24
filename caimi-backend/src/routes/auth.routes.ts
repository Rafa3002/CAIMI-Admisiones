import {
  Router,
} from "express";

import bcrypt from "bcryptjs";

import {
  db,
} from "../database/db";

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


router.post(
  "/login",

  async (
    request,
    response
  ) => {

    try {

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


      /*
       * Buscar usuario en PostgreSQL.
       */

      const result =
        await db.query(
          `
          SELECT

            id,

            name,

            username,

            password_hash,

            role,

            active

          FROM users

          WHERE username = $1

          LIMIT 1;
          `,

          [
            username,
          ]
        );


      if (
        result.rows.length ===
        0
      ) {

        response
          .status(401)
          .json({
            message:
              "Usuario o contraseña incorrectos.",
          });

        return;
      }


      const user =
        result.rows[0];


      if (!user.active) {

        response
          .status(401)
          .json({
            message:
              "La cuenta está deshabilitada.",
          });

        return;
      }


      const passwordOk =
        await bcrypt.compare(

          password,

          user.password_hash
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

    } catch (error) {

      console.error(
        error
      );

      response
        .status(500)
        .json({
          message:
            "Error interno del servidor.",
        });
    }
  }
);


router.get(
  "/me",

  authenticate,

  async (
    request:
      AuthenticatedRequest,

    response
  ) => {

    try {

      const result =
        await db.query(
          `
          SELECT

            id,

            name,

            username,

            role,

            active

          FROM users

          WHERE id = $1;
          `,

          [
            request.user?.id,
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
            "Error interno.",
        });
    }
  }
);


export default router;