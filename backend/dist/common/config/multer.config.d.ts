export declare const multerConfig: {
    storage: import("multer").StorageEngine;
    fileFilter: (_req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void;
    limits: {
        fileSize: number;
    };
};
