import dotenv from "dotenv";
import { Pool } from "pg";

/*
 * Cargar las variables del archivo .env
 */
dotenv.config();

/*
 * Obtener la cadena de conexión.
 */
const connectionString =
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL no está configurado en el archivo .env"
  );
}

/*
 * Pool de conexiones PostgreSQL.
 */
export const db = new Pool({
  connectionString,
});

/*
 * Detectar errores inesperados de PostgreSQL.
 */
db.on("error", (error) => {
  console.error(
    "Error inesperado de PostgreSQL:",
    error
  );
});