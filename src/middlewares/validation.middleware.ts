import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/app-error.util";
import { ResponseUtil } from "../utils/response.util";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = (error as any).issues.map(
          (e: any) => `${e.path.join(".")}: ${e.message}`
        );
        next(new AppError(`Validation failed: ${messages.join(", ")}`, 400));
      } else {
        next(error);
      }
    }
  };

export const handleError = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(ResponseUtil.error(err.message, err.stack));
    return;
  }

  res.status(500).json(ResponseUtil.error("Internal server error"));
};