"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = Number(process.env.PORT) || 4000;
app_1.default.listen(PORT, () => {
    console.log("--------------------------------");
    console.log("CAIMI Backend");
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log("--------------------------------");
});
