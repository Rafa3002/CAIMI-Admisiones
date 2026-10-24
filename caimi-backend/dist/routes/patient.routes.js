"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = require("crypto");
const db_1 = require("../database/db");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const patient_schema_1 = require("../schemas/patient.schema");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/*
 * =================================
 * GET /api/patients
 * =================================
 */
router.get("/", async (request, response) => {
    try {
        const query = String(request.query.q || "").trim();
        const search = `%${query}%`;
        const result = await db_1.db.query(`
          SELECT

            p.id,

            p.cui,

            p.expediente,

            p.first_name
              AS "firstName",

            p.second_name
              AS "secondName",

            p.first_surname
              AS "firstSurname",

            p.second_surname
              AS "secondSurname",

            p.birth_date
              AS "birthDate",

            p.sex,

            p.phone,

            p.department,

            p.municipality,

            p.community,

            p.address,

            COUNT(a.id)::int
              AS "admissionsCount"

          FROM patients p

          LEFT JOIN admissions a

            ON a.patient_id =
               p.id


          WHERE

            $1 = ''

            OR p.cui ILIKE $2

            OR p.expediente ILIKE $2

            OR p.first_name ILIKE $2

            OR p.second_name ILIKE $2

            OR p.first_surname ILIKE $2

            OR p.second_surname ILIKE $2

            OR CONCAT_WS(
              ' ',

              p.first_name,

              p.second_name,

              p.first_surname,

              p.second_surname

            ) ILIKE $2


          GROUP BY p.id


          ORDER BY

            p.first_surname ASC,

            p.first_name ASC


          LIMIT 50;
          `, [
            query,
            search,
        ]);
        response.json(result.rows);
    }
    catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
            message: "No fue posible consultar los pacientes.",
        });
    }
});
/*
 * =================================
 * GET /api/patients/:id
 * =================================
 */
router.get("/:id", async (request, response) => {
    try {
        const patientResult = await db_1.db.query(`
          SELECT

            id,

            cui,

            expediente,

            first_name
              AS "firstName",

            second_name
              AS "secondName",

            first_surname
              AS "firstSurname",

            second_surname
              AS "secondSurname",

            married_surname
              AS "marriedSurname",

            birth_date
              AS "birthDate",

            sex,

            phone,

            department,

            municipality,

            community,

            address,

            created_at
              AS "createdAt",

            updated_at
              AS "updatedAt"

          FROM patients

          WHERE id = $1;
          `, [
            request.params.id,
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
        const admissionsResult = await db_1.db.query(`
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
            request.params.id,
        ]);
        response.json({
            ...patientResult.rows[0],
            admissions: admissionsResult.rows,
        });
    }
    catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
            message: "Error consultando paciente.",
        });
    }
});
/*
 * =================================
 * POST /api/patients
 * =================================
 */
router.post("/", (0, role_middleware_1.requireRole)("ADMIN", "ADMISIONES"), async (request, response) => {
    try {
        const validation = patient_schema_1.patientSchema.safeParse(request.body);
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
         * CUI duplicado
         */
        if (data.cui) {
            const cuiResult = await db_1.db.query(`
            SELECT id
            FROM patients
            WHERE cui = $1
            LIMIT 1;
            `, [
                data.cui,
            ]);
            if (cuiResult.rows.length >
                0) {
                response
                    .status(409)
                    .json({
                    message: "Ya existe un paciente con este CUI.",
                });
                return;
            }
        }
        /*
         * Posible duplicado
         */
        const duplicateResult = await db_1.db.query(`
          SELECT

            id,

            cui,

            expediente,

            first_name
              AS "firstName",

            first_surname
              AS "firstSurname",

            birth_date
              AS "birthDate"

          FROM patients

          WHERE

            LOWER(first_name)
              =
            LOWER($1)

            AND

            LOWER(first_surname)
              =
            LOWER($2)

            AND

            (
              birth_date = $3::date

              OR $3::date IS NULL
            )

          LIMIT 1;
          `, [
            data.firstName,
            data.firstSurname,
            data.birthDate ||
                null,
        ]);
        if (duplicateResult.rows.length >
            0 &&
            request.body
                .confirmDuplicate !==
                true) {
            response
                .status(409)
                .json({
                message: "Se encontró un posible paciente duplicado.",
                requiresConfirmation: true,
                possibleDuplicate: duplicateResult.rows[0],
            });
            return;
        }
        const id = (0, crypto_1.randomUUID)();
        const result = await db_1.db.query(`
          INSERT INTO patients (

            id,

            cui,

            expediente,

            first_name,

            second_name,

            first_surname,

            second_surname,

            married_surname,

            birth_date,

            sex,

            phone,

            department,

            municipality,

            community,

            address

          )

          VALUES (

            $1, $2, $3, $4, $5,

            $6, $7, $8, $9, $10,

            $11, $12, $13, $14, $15

          )

          RETURNING

            id,

            cui,

            expediente,

            first_name
              AS "firstName",

            second_name
              AS "secondName",

            first_surname
              AS "firstSurname",

            second_surname
              AS "secondSurname",

            married_surname
              AS "marriedSurname",

            birth_date
              AS "birthDate",

            sex,

            phone,

            department,

            municipality,

            community,

            address,

            created_at
              AS "createdAt",

            updated_at
              AS "updatedAt";
          `, [
            id,
            data.cui ||
                null,
            data.expediente,
            data.firstName,
            data.secondName ||
                null,
            data.firstSurname,
            data.secondSurname ||
                null,
            data.marriedSurname ||
                null,
            data.birthDate ||
                null,
            data.sex ||
                null,
            data.phone ||
                null,
            data.department ||
                null,
            data.municipality ||
                null,
            data.community ||
                null,
            data.address ||
                null,
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
            message: "No fue posible registrar el paciente.",
        });
    }
});
router.patch("/:id", (0, role_middleware_1.requireRole)("ADMIN", "ADMISIONES"), async (request, response) => {
    try {
        const validation = patient_schema_1.patientSchema.safeParse(request.body);
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
         * Verificar existencia.
         */
        const existing = await db_1.db.query(`
          SELECT id
          FROM patients
          WHERE id = $1;
          `, [
            request.params.id,
        ]);
        if (existing.rows.length === 0) {
            response
                .status(404)
                .json({
                message: "Paciente no encontrado.",
            });
            return;
        }
        /*
         * Evitar CUI duplicado.
         */
        if (data.cui) {
            const duplicateCui = await db_1.db.query(`
            SELECT id

            FROM patients

            WHERE cui = $1
              AND id <> $2

            LIMIT 1;
            `, [
                data.cui,
                request.params.id,
            ]);
            if (duplicateCui.rows.length > 0) {
                response
                    .status(409)
                    .json({
                    message: "Otro paciente ya utiliza este CUI.",
                });
                return;
            }
        }
        /*
         * Evitar expediente duplicado.
         */
        const duplicateExpediente = await db_1.db.query(`
          SELECT id

          FROM patients

          WHERE expediente = $1
            AND id <> $2

          LIMIT 1;
          `, [
            data.expediente,
            request.params.id,
        ]);
        if (duplicateExpediente.rows.length >
            0) {
            response
                .status(409)
                .json({
                message: "Otro paciente ya utiliza este número de expediente.",
            });
            return;
        }
        const result = await db_1.db.query(`
          UPDATE patients

          SET
            cui = $2,
            expediente = $3,
            first_name = $4,
            second_name = $5,
            first_surname = $6,
            second_surname = $7,
            married_surname = $8,
            birth_date = $9,
            sex = $10,
            phone = $11,
            department = $12,
            municipality = $13,
            community = $14,
            address = $15,
            updated_at = NOW()

          WHERE id = $1

          RETURNING

            id,

            cui,

            expediente,

            first_name
              AS "firstName",

            second_name
              AS "secondName",

            first_surname
              AS "firstSurname",

            second_surname
              AS "secondSurname",

            married_surname
              AS "marriedSurname",

            birth_date
              AS "birthDate",

            sex,

            phone,

            department,

            municipality,

            community,

            address,

            created_at
              AS "createdAt",

            updated_at
              AS "updatedAt";
          `, [
            request.params.id,
            data.cui || null,
            data.expediente,
            data.firstName,
            data.secondName || null,
            data.firstSurname,
            data.secondSurname || null,
            data.marriedSurname || null,
            data.birthDate || null,
            data.sex || null,
            data.phone || null,
            data.department || null,
            data.municipality || null,
            data.community || null,
            data.address || null,
        ]);
        response.json(result.rows[0]);
    }
    catch (error) {
        console.error("Error actualizando paciente:", error);
        response
            .status(500)
            .json({
            message: "No fue posible actualizar el paciente.",
        });
    }
});
exports.default = router;
