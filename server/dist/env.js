"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    PORT: Number(process.env.PORT ?? 3000),
    NODE_ENV: process.env.NODE_ENV ?? "development"
};
