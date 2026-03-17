import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from './errorHandler';

export const validate = (schema: z.ZodSchema<any>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error?.name === 'ZodError' || error instanceof ZodError) {
        const message = error.errors.map((e: any) => e.message).join(', ');
        return next(new ValidationError(message));
      }
      next(error);
    }
  };
};
