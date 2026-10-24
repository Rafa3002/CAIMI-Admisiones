"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const admission_routes_1 = __importDefault(require("./routes/admission.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const app = (0, express_1.default)();
/*
 * Permite recibir JSON.
 */
app.use(express_1.default.json());
/*
 * Permitimos que nuestro
 * frontend localhost:3000
 * se comunique con el backend.
 */
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL ||
        "http://localhost:3000",
    credentials: true,
}));
/*
 * Ruta básica para comprobar
 * que el backend está activo.
 */
app.get("/", (request, response) => {
    response.json({
        name: "CAIMI API",
        status: "running",
        message: "Backend funcionando correctamente",
    });
});
/*
 * Rutas de la aplicación.
 */
app.use("/api/auth", auth_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/patients", patient_routes_1.default);
app.use("/api/admissions", admission_routes_1.default);
app.use("/api/reports", report_routes_1.default);
app.use("/api/users", user_routes_1.default);
exports.default = app;
