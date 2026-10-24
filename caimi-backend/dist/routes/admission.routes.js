"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = require("crypto");
const db_1 = require("../database/db");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const admission_schema_1 = require("../schemas/admission.schema");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/*
 * GET /api/admissions
 */
router.get("/", async (request, response) => {
    try {
        const result = await db_1.db.query(`
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
        response.json(result.rows);
    }
    catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
            message: "Error consultando admisiones.",
        });
    }
});
/*
 * GET /api/admissions/patient/:patientId
 */
router.get("/patient/:patientId", async (request, response) => {
    try {
        const result = await db_1.db.query(`
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
          `, [
            request.params.patientId,
        ]);
        response.json(result.rows);
    }
    catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
            message: "Error consultando admisiones.",
        });
    }
});
/*
 * POST /api/admissions
 */
router.post("/", (0, role_middleware_1.requireRole)("ADMIN", "ADMISIONES"), async (request, response) => {
    try {
        const validation = admission_schema_1.admissionSchema.safeParse(request.body);
        if (!validation.success) {
            response
                .status(400)
                .json({
                message: "Información inválida.",
                errors: validation.error.flatten(),
            });
            return;
        }
        const data = validation.data;
        /*
         * Verificar paciente
         */
        const patientResult = await db_1.db.query(`
          SELECT id
          FROM patients
          WHERE id = $1;
          `, [
            data.patientId,
        ]);
        if (patientResult.rows.length ===
            0) {
            response
                .status(404)
                .json({
                message: "Paciente no encontrado.",
            });
            return;
        }
        const id = (0, crypto_1.randomUUID)();
        const result = await db_1.db.query(`
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
          `, [
            id,
            data.patientId,
            data.date,
            data.service,
            data.area,
            data.reason,
            data.observations ||
                null,
            request.user.id,
        ]);
        response
            .status(201)
            .json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
            message: "No fue posible registrar la admisión.",
        });
    }
});
exports.default = router;
