"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET no está configurado");
    }
    return secret;
}
function createToken(payload) {
    return jsonwebtoken_1.default.sign(payload, getSecret(), {
        expiresIn: "8h",
    });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, getSecret());
}
