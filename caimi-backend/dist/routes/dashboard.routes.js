"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get("/summary", async (request, response) => {
    try {
        const [patientsResult, admissionsResult, recurrentResult, servicesResult, recentPatientsResult,] = await Promise.all([
            db_1.db.query(`
          SELECT COUNT(*)::int AS total
          FROM patients;
        `),
            db_1.db.query(`
          SELECT COUNT(*)::int AS total
          FROM admissions;
        `),
            db_1.db.query(`
          SELECT COUNT(*)::int AS total
          FROM (
            SELECT patient_id
            FROM admissions
            GROUP BY patient_id
            HAVING COUNT(*) > 1
          ) recurrent;
        `),
            db_1.db.query(`
          SELECT
            COUNT(
              DISTINCT service
            )::int AS total
          FROM admissions;
        `),
            db_1.db.query(`
          SELECT

            p.id,

            p.expediente,

            p.first_name
              AS "firstName",

            p.first_surname
              AS "firstSurname",

            p.municipality,

            COUNT(a.id)::int
              AS "admissionsCount"

          FROM patients p

          LEFT JOIN admissions a
            ON a.patient_id = p.id

          GROUP BY p.id

          ORDER BY
            p.created_at DESC

          LIMIT 5;
        `),
        ]);
        response.json({
            totalPatients: patientsResult.rows[0].total,
            totalAdmissions: admissionsResult.rows[0].total,
            recurrentPatients: recurrentResult.rows[0].total,
            activeServices: servicesResult.rows[0].total,
            recentPatients: recentPatientsResult.rows,
        });
    }
    catch (error) {
        console.error("Error dashboard:", error);
        response
            .status(500)
            .json({
            message: "No fue posible cargar el dashboard.",
        });
    }
});
exports.default = router;
