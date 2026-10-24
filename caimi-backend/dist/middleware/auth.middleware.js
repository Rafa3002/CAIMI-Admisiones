"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_1 = require("../utils/jwt");
const db_1 = require("../database/db");
async function authenticate(request, response, next) {
    const authorization = request.headers.authorization;
    if (!authorization ||
        !authorization.startsWith("Bearer ")) {
        response
            .status(401)
            .json({
            message: "Debe iniciar sesión.",
        });
        return;
    }
    const token = authorization.substring(7);
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        /*
         * Verificamos que el usuario
         * todavía exista y esté activo.
         */
        const result = await db_1.db.query(`
        SELECT

          id,

          username,

          role,

          active

        FROM users

        WHERE id = $1

        LIMIT 1;
        `, [
            payload.userId,
        ]);
        if (result.rows.length ===
            0) {
            response
                .status(401)
                .json({
                message: "Usuario no encontrado.",
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
        request.user = {
            id: user.id,
            username: user.username,
            role: user.role,
        };
        next();
    }
    catch (error) {
        response
            .status(401)
            .json({
            message: "Sesión inválida o expirada.",
        });
    }
}
