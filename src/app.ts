import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import patientRoutes from "./routes/patient.routes";
import admissionRoutes from "./routes/admission.routes";
import reportRoutes from "./routes/report.routes";
import userRoutes from "./routes/user.routes";

const app =
  express();

/*
 * Permite recibir JSON.
 */
app.use(
  express.json()
);

/*
 * Permitimos que nuestro
 * frontend localhost:3000
 * se comunique con el backend.
 */
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:3000",

    credentials:
      true,
  })
);

/*
 * Ruta básica para comprobar
 * que el backend está activo.
 */
app.get(
  "/",
  (
    request,
    response
  ) => {

    response.json({
      name:
        "CAIMI API",

      status:
        "running",

      message:
        "Backend funcionando correctamente",
    });
  }
);

/*
 * Rutas de la aplicación.
 */
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/patients",
  patientRoutes
);

app.use(
  "/api/admissions",
  admissionRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/users",
  userRoutes
);

export default app;