import {
  Router,
} from "express";

import {
  randomUUID,
} from "crypto";

import {
  db,
} from "../database/db";

import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
  requireRole,
} from "../middleware/role.middleware";

import {
  admissionSchema,
} from "../schemas/admission.schema";


const router =
  Router();


router.use(
  authenticate
);


/*
 * GET /api/admissions
 */

router.get(
  "/",

  async (
    request,
    response
  ) => {

    try {

      const result =
  await db.query(`
    SELECT

      a.id,

      a.patient_id
        AS "patientId",

      a.admission_date
        AS "date",

      a.service,

      a.area,

      a.reason,

      a.observations,

      a.responsible_user_id
        AS "responsibleUserId",

      u.name
        AS "responsible",

      p.expediente,

      CONCAT_WS(
        ' ',
        p.first_name,
        p.second_name,
        p.first_surname,
        p.second_surname
      )
        AS "patientName"

    FROM admissions a

    INNER JOIN users u
      ON u.id =
         a.responsible_user_id

    INNER JOIN patients p
      ON p.id =
         a.patient_id

    ORDER BY
      a.admission_date DESC;
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
            "Error consultando admisiones.",
        });
    }
  }
);


/*
 * GET /api/admissions/patient/:patientId
 */

router.get(
  "/patient/:patientId",

  async (
    request,
    response
  ) => {

    try {

      const result =
        await db.query(
          `
          SELECT

            a.id,

            a.patient_id
              AS "patientId",

            a.admission_date
              AS "date",

            a.service,

            a.area,

            a.reason,

            a.observations,

            u.name
              AS "responsible"

          FROM admissions a

          INNER JOIN users u

            ON u.id =
               a.responsible_user_id

          WHERE
            a.patient_id = $1

          ORDER BY
            a.admission_date DESC;
          `,

          [
            request.params.patientId,
          ]
        );


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
            "Error consultando admisiones.",
        });
    }
  }
);


/*
 * POST /api/admissions
 */

router.post(
  "/",

  requireRole(
    "ADMIN",
    "ADMISIONES"
  ),

  async (
    request:
      AuthenticatedRequest,

    response
  ) => {

    try {

      const validation =
        admissionSchema.safeParse(
          request.body
        );


      if (
        !validation.success
      ) {

        response
          .status(400)
          .json({

            message:
              "Información inválida.",

            errors:
              validation.error.flatten(),
          });

        return;
      }


      const data =
        validation.data;


      /*
       * Verificar paciente
       */
      const patientResult =
        await db.query(
          `
          SELECT id
          FROM patients
          WHERE id = $1;
          `,

          [
            data.patientId,
          ]
        );


      if (
        patientResult.rows.length ===
        0
      ) {

        response
          .status(404)
          .json({
            message:
              "Paciente no encontrado.",
          });

        return;
      }


      const id =
        randomUUID();


      const result =
        await db.query(
          `
          INSERT INTO admissions (

            id,

            patient_id,

            admission_date,

            service,

            area,

            reason,

            observations,

            responsible_user_id

          )

          VALUES (

            $1,

            $2,

            $3,

            $4,

            $5,

            $6,

            $7,

            $8

          )

          RETURNING

            id,

            patient_id
              AS "patientId",

            admission_date
              AS "date",

            service,

            area,

            reason,

            observations,

            responsible_user_id
              AS "responsibleUserId";
          `,

          [

            id,

            data.patientId,

            data.date,

            data.service,

            data.area,

            data.reason,

            data.observations ||
              null,

            request.user!.id,
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
            "No fue posible registrar la admisión.",
        });
    }
  }
);


export default router;