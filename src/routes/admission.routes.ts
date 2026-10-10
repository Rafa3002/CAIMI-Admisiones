import {
  Router,
} from "express";

import {
  admissions,
  patients,
} from "../data/mock-db";

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

  (
    request,
    response
  ) => {

    response.json(
      admissions
    );
  }
);

/*
 * GET /api/admissions/patient/:patientId
 */
router.get(
  "/patient/:patientId",

  (
    request,
    response
  ) => {

    const patient =
      patients.find(
        (item) =>
          item.id ===
          request.params.patientId
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

    const result =
      admissions.filter(
        (admission) =>
          admission.patientId ===
          patient.id
      );

    response.json(
      result
    );
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

  (
    request:
      AuthenticatedRequest,

    response
  ) => {

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

    const patient =
      patients.find(
        (item) =>
          item.id ===
          data.patientId
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

    const admission = {

      id:
        `ADM-${Date.now()}`,

      ...data,

      responsibleUserId:
        request.user!.id,
    };

    admissions.push(
      admission
    );

    response
      .status(201)
      .json(
        admission
      );
  }
);

export default router;