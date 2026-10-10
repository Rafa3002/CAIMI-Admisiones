import {
  Router,
} from "express";

import {
  admissions,
  patients,
} from "../data/mock-db";

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

/*
 * GET /api/reports/summary
 */
router.get(
  "/summary",

  requireRole(
    "ADMIN",
    "ADMISIONES"
  ),

  (
    request,
    response
  ) => {

    const recurrentPatients =
      patients.filter(
        (patient) => {

          const count =
            admissions.filter(
              (
                admission
              ) =>
                admission.patientId ===
                patient.id
            ).length;

          return count > 1;
        }
      ).length;

    const byService =
      admissions.reduce<
        Record<
          string,
          number
        >
      >(
        (
          accumulator,
          admission
        ) => {

          accumulator[
            admission.service
          ] =
            (
              accumulator[
                admission.service
              ] || 0
            ) + 1;

          return accumulator;
        },
        {}
      );

    response.json({

      totalPatients:
        patients.length,

      totalAdmissions:
        admissions.length,

      recurrentPatients,

      byService,
    });
  }
);

export default router;