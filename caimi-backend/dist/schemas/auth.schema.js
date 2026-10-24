"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string()
        .trim()
        .min(3, "El usuario es obligatorio"),
    password: zod_1.z.string()
        .min(6, "La contraseña es obligatoria"),
});
