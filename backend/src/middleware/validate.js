"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
            return;
        }
        next(error);
    }
};
exports.default = validate;
