import type { Request, Response, NextFunction } from "express";
import { type AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
      });

      // Update request objects with validated and transformed data
      req.body = validatedData.body ?? req.body;
      req.query = validatedData.query ?? (req.query as any);
      req.params = validatedData.params ?? req.params;
      
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      return res.status(500).json({ error: "Internal server error during validation" });
    }
  };
};
