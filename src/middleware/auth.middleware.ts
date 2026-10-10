import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  verifyToken,
} from "../utils/jwt";

import {
  users,
} from "../data/mock-db";

export interface AuthenticatedRequest
  extends Request {

  user?: {
    id: string;

    username: string;

    role:
      | "ADMIN"
      | "ADMISIONES"
      | "CONSULTA";
  };
}

export function authenticate(
  request:
    AuthenticatedRequest,

  response:
    Response,

  next:
    NextFunction
) {

  const authorization =
    request.headers.authorization;

  if (
    !authorization ||
    !authorization.startsWith(
      "Bearer "
    )
  ) {

    response
      .status(401)
      .json({
        message:
          "Debe iniciar sesión.",
      });

    return;
  }

  const token =
    authorization.substring(
      7
    );

  try {

    const payload =
      verifyToken(
        token
      );

    const user =
      users.find(
        (item) =>
          item.id ===
          payload.userId
      );

    if (
      !user ||
      !user.active
    ) {

      response
        .status(401)
        .json({
          message:
            "La cuenta no está disponible.",
        });

      return;
    }

    request.user = {
      id:
        user.id,

      username:
        user.username,

      role:
        user.role,
    };

    next();

  } catch {

    response
      .status(401)
      .json({
        message:
          "Sesión inválida o expirada.",
      });
  }
}