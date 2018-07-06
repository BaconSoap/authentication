import { Request, Response, Handler } from "express";
import Joi from 'joi';
import { Application, PathParams } from "../node_modules/@types/express-serve-static-core";

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

export const postValidatedAsync = (app: Application, route: PathParams, schema: Joi.Schema, handler: (req: Request, res: Response) => Promise<any>) => {
  app.post(route, validationHandler(schema, asyncHandler(handler)));
}

export const getAsync = (app: Application, route: PathParams, handler: (req: Request, res: Response) => Promise<any>) => {
  app.get(route, asyncHandler(handler));
}
