import {
  Router,
} from "express";

import {
  db,
} from "../database/db";

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


router.get(
  "/summary",

  requireRole(
    "ADMIN",
    "ADMISIONES"
  ),

  async (
    request,
    response
  ) => {

    try {

      const patientsResult =
        await db.query(`
          SELECT COUNT(*)::int
            AS total
          FROM patients;
        `);


      const admissionsResult =
        await db.query(`
          SELECT COUNT(*)::int
            AS total
          FROM admissions;
        `);


      const recurrentResult =
        await db.query(`
          SELECT COUNT(*)::int
            AS total

          FROM (

            SELECT
              patient_id

            FROM admissions

            GROUP BY
              patient_id

            HAVING
              COUNT(*) > 1

          ) recurrent;
        `);


      const servicesResult =
        await db.query(`
          SELECT

            service,

            COUNT(*)::int
              AS total

          FROM admissions

          GROUP BY
            service

          ORDER BY
            total DESC;
        `);


      const byService:
        Record<
          string,
          number
        > = {};


      for (
        const row
        of servicesResult.rows
      ) {

        byService[
          row.service
        ] =
          row.total;
      }


      response.json({

        totalPatients:
          patientsResult
            .rows[0]
            .total,

        totalAdmissions:
          admissionsResult
            .rows[0]
            .total,

        recurrentPatients:
          recurrentResult
            .rows[0]
            .total,

        byService,
      });

    } catch (error) {

      console.error(
        error
      );

      response
        .status(500)
        .json({
          message:
            "Error generando reporte.",
        });
    }
  }
);


export default router;