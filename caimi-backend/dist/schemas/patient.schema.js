"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientSchema = void 0;
const zod_1 = require("zod");
exports.patientSchema = zod_1.z.object({
    cui: zod_1.z.string()
        .trim()
        .optional(),
    expediente: zod_1.z.string()
        .trim()
        .min(1, "El expediente es obligatorio"),
    firstName: zod_1.z.string()
        .trim()
        .min(2, "El primer nombre es obligatorio"),
    secondName: zod_1.z.string()
        .trim()
        .optional(),
    firstSurname: zod_1.z.string()
        .trim()
        .min(2, "El primer apellido es obligatorio"),
    secondSurname: zod_1.z.string()
        .trim()
        .optional(),
    marriedSurname: zod_1.z.string()
        .trim()
        .optional(),
    birthDate: zod_1.z.string()
        .optional(),
    sex: zod_1.z.string()
        .optional(),
    phone: zod_1.z.string()
        .optional(),
    department: zod_1.z.string()
        .optional(),
    municipality: zod_1.z.string()
        .optional(),
    community: zod_1.z.string()
        .optional(),
    address: zod_1.z.string()
        .optional(),
});
