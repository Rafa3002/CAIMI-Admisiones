"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../database/db");
const auth_schema_1 = require("../schemas/auth.schema");
const jwt_1 = require("../utils/jwt");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/login", async (request, response) => {
    try {
        const validation = auth_schema_1.loginSchema.safeParse(request.body);
        if (!validation.success) {
            response
                .status(400)
                .json({
                message: "Datos inválidos.",
                errors: validation.error.flatten(),
            });
            return;
        }
        const { username, password, } = validation.data;
        /*
         * Buscar usuario en PostgreSQL.
         */
        const result = await db_1.db.query(`
          SELECT

            id,

            name,

            username,

            password_hash,

            role,

            active

          FROM users

          WHERE username = $1

          LIMIT 1;
          `, [
            username,
        ]);
        if (result.rows.length ===
            0) {
            response
                .status(401)
                .json({
                message: "Usuario o contraseña incorrectos.",
            });
            return;
        }
        const user = result.rows[0];
        if (!user.active) {
            response
                .status(401)
                .json({
                message: "La cuenta está deshabilitada.",
            });
            return;
        }
        const passwordOk = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!passwordOk) {
            response
                .status(401)
                .json({
                message: "Usuario o contraseña incorrectos.",
            });
            return;
        }
        const token = (0, jwt_1.createToken)({
            userId: user.id,
            username: user.username,
            role: user.role,
        });
        response.json({
            message: "Inicio de sesión exitoso.",
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
            message: "Error interno del servidor.",
        });
    }
});
router.get("/me", auth_middleware_1.authenticate, async (request, response) => {
    try {
        const result = await db_1.db.query(`
          SELECT

            id,

            name,

            username,

            role,

            active

          FROM users

          WHERE id = $1;
          `, [
            request.user?.id,
        ]);
        if (result.rows.length ===
            0) {
            response
                .status(404)
                .json({
                message: "Usuario no encontrado.",
            });
            return;
        }
        response.json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
            message: "Error interno.",
        });
    }
});
exports.default = router;
