import {
  NextFunction,
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "./auth.middleware";

import {
  Role,
} from "../types";

export function requireRole(
  ...roles: Role[]
) {

  return (
    request:
      AuthenticatedRequest,

    response:
      Response,

    next:
      NextFunction
  ) => {

    if (!request.user) {

      response
        .status(401)
        .json({
          message:
            "No autenticado.",
        });

      return;
    }

    if (
      !roles.includes(
        request.user.role
      )
    ) {

      response
        .status(403)
        .json({
          message:
            "No tiene permiso para realizar esta operación.",
        });

      return;
    }

    next();
  };
}