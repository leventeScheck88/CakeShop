"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (_req, file, callback) => {
            const name = (0, uuid_1.v4)();
            const ext = (0, path_1.extname)(file.originalname);
            callback(null, `${name}${ext}`);
        },
    }),
    fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            callback(new Error('Only image files are allowed'), false);
            return;
        }
        callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
};
//# sourceMappingURL=multer.config.js.map