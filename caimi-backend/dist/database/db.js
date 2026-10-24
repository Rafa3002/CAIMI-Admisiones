"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
/*
 * Cargar las variables del archivo .env
 */
dotenv_1.default.config();
/*
 * Obtener la cadena de conexión.
 */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL no está configurado en el archivo .env");
}
/*
 * Pool de conexiones PostgreSQL.
 */
exports.db = new pg_1.Pool({
    connectionString,
});
/*
 * Detectar errores inesperados de PostgreSQL.
 */
exports.db.on("error", (error) => {
    console.error("Error inesperado de PostgreSQL:", error);
});
