import { Request, Response, Handler } from "express";
import Joi from 'joi';

export const asyncHandler = (handler: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response) => {
    handler(req, res)
      .catch((e) => {
        console.error('error occured: ', e);
        res.sendStatus(500);
      })
  }
}

export const validationHandler = (validator: Joi.Schema, next: (req: Request, res: Response) => void): Handler => {
  return (req, res) => {
    const validationResults = validator.validate(req.body, {
      abortEarly: false
    });

    if (validationResults.error) {
      res.status(400).send({
        isValidationError: true,
        details: validationResults.error.details
      });

      return;
    }

    next(req, res);
  }
}
