import jwt from "jsonwebtoken";

import {
  Role,
} from "../types";

export interface TokenPayload {
  userId: string;

  username: string;

  role: Role;
}

function getSecret() {

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {

    throw new Error(
      "JWT_SECRET no está configurado"
    );
  }

  return secret;
}

export function createToken(
  payload: TokenPayload
) {

  return jwt.sign(
    payload,
    getSecret(),
    {
      expiresIn:
        "8h",
    }
  );
}

export function verifyToken(
  token: string
) {

  return jwt.verify(
    token,
    getSecret()
  ) as TokenPayload;
}