"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admissionSchema = void 0;
const zod_1 = require("zod");
exports.admissionSchema = zod_1.z.object({
    patientId: zod_1.z.string()
        .min(1),
    date: zod_1.z.string()
        .min(1, "La fecha es obligatoria"),
    service: zod_1.z.string()
        .trim()
        .min(2, "El servicio es obligatorio"),
    area: zod_1.z.string()
        .trim()
        .min(1, "El área es obligatoria"),
    reason: zod_1.z.string()
        .trim()
        .min(3, "El motivo es obligatorio"),
    observations: zod_1.z.string()
        .optional(),
});
