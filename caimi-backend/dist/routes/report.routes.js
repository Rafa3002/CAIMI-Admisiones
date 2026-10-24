"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get("/summary", (0, role_middleware_1.requireRole)("ADMIN", "ADMISIONES"), async (request, response) => {
    try {
        const patientsResult = await db_1.db.query(`
          SELECT COUNT(*)::int
            AS total
          FROM patients;
        `);
        const admissionsResult = await db_1.db.query(`
          SELECT COUNT(*)::int
            AS total
          FROM admissions;
        `);
        const recurrentResult = await db_1.db.query(`
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
        const servicesResult = await db_1.db.query(`
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
        const byService = {};
        for (const row of servicesResult.rows) {
            byService[row.service] =
                row.total;
        }
        response.json({
            totalPatients: patientsResult
                .rows[0]
                .total,
            totalAdmissions: admissionsResult
                .rows[0]
                .total,
            recurrentPatients: recurrentResult
                .rows[0]
                .total,
            byService,
        });
    }
    catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
            message: "Error generando reporte.",
        });
    }
});
exports.default = router;
