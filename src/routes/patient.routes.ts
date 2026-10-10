import {
  Router,
} from "express";

import {
  patients,
  admissions,
} from "../data/mock-db";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  requireRole,
} from "../middleware/role.middleware";

import {
  patientSchema,
} from "../schemas/patient.schema";

const router =
  Router();

/*
 * Todas las rutas de pacientes
 * necesitan autenticación.
 */
router.use(
  authenticate
);

/*
 * GET /api/patients
 *
 * GET /api/patients?q=Maria
 */
router.get(
  "/",

  (
    request,
    response
  ) => {

    const query =
      String(
        request.query.q || ""
      )
        .trim()
        .toLowerCase();

    let result =
      patients;

    if (query) {

      result =
        patients.filter(
          (patient) => {

            const fullName =
              [
                patient.firstName,
                patient.secondName,
                patient.firstSurname,
                patient.secondSurname,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
              fullName.includes(
                query
              ) ||

              patient.cui
                ?.toLowerCase()
                .includes(
                  query
                ) ||

              patient.expediente
                .toLowerCase()
                .includes(
                  query
                )
            );
          }
        );
    }

    const resultWithAdmissions =
      result.map(
        (patient) => ({

          ...patient,

          admissionsCount:
            admissions.filter(
              (
                admission
              ) =>
                admission.patientId ===
                patient.id
            ).length,
        })
      );

    response.json(
      resultWithAdmissions
    );
  }
);

/*
 * GET /api/patients/:id
 */
router.get(
  "/:id",

  (
    request,
    response
  ) => {

    const patient =
      patients.find(
        (item) =>
          item.id ===
          request.params.id
      );

    if (!patient) {

      response
        .status(404)
        .json({
          message:
            "Paciente no encontrado.",
        });

      return;
    }

    const patientAdmissions =
      admissions.filter(
        (admission) =>
          admission.patientId ===
          patient.id
      );

    response.json({

      ...patient,

      admissions:
        patientAdmissions,
    });
  }
);

/*
 * POST /api/patients
 *
 * CONSULTA no puede crear.
 */
router.post(
  "/",

  requireRole(
    "ADMIN",
    "ADMISIONES"
  ),

  (
    request,
    response
  ) => {

    const validation =
      patientSchema.safeParse(
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
     * Evitar CUI duplicado.
     */
    if (data.cui) {

      const existing =
        patients.find(
          (patient) =>
            patient.cui ===
            data.cui
        );

      if (existing) {

        response
          .status(409)
          .json({
            message:
              "Ya existe un paciente registrado con este CUI.",

            patient:
              existing,
          });

        return;
      }
    }

    /*
     * Posible duplicado por nombre,
     * apellido y fecha.
     */
    const possibleDuplicate =
      patients.find(
        (patient) =>
          patient.firstName
            .toLowerCase() ===
            data.firstName
              .toLowerCase() &&

          patient.firstSurname
            .toLowerCase() ===
            data.firstSurname
              .toLowerCase() &&

          patient.birthDate ===
            data.birthDate
      );

    if (
      possibleDuplicate &&
      request.body
        .confirmDuplicate !== true
    ) {

      response
        .status(409)
        .json({

          message:
            "Se encontró un posible paciente duplicado.",

          requiresConfirmation:
            true,

          possibleDuplicate,
        });

      return;
    }

    const now =
      new Date()
        .toISOString();

    const patient = {

      id:
        `PAT-${Date.now()}`,

      ...data,

      createdAt:
        now,

      updatedAt:
        now,
    };

    patients.push(
      patient
    );

    response
      .status(201)
      .json(
        patient
      );
  }
);

/*
 * PATCH /api/patients/:id
 */
router.patch(
  "/:id",

  requireRole(
    "ADMIN",
    "ADMISIONES"
  ),

  (
    request,
    response
  ) => {

    const patientIndex =
      patients.findIndex(
        (item) =>
          item.id ===
          request.params.id
      );

    if (
      patientIndex === -1
    ) {

      response
        .status(404)
        .json({
          message:
            "Paciente no encontrado.",
        });

      return;
    }

    const validation =
      patientSchema
        .partial()
        .safeParse(
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

    const updatedPatient = {

      ...patients[
        patientIndex
      ],

      ...validation.data,

      updatedAt:
        new Date()
          .toISOString(),
    };

    patients[
      patientIndex
    ] =
      updatedPatient;

    response.json(
      updatedPatient
    );
  }
);

export default router;