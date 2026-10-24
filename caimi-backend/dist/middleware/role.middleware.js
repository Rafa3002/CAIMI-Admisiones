"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
function requireRole(...roles) {
    return (request, response, next) => {
        if (!request.user) {
            response
                .status(401)
                .json({
                message: "No autenticado.",
            });
            return;
        }
        if (!roles.includes(request.user.role)) {
            response
                .status(403)
                .json({
                message: "No tiene permiso para realizar esta operación.",
            });
            return;
        }
        next();
    };
}
