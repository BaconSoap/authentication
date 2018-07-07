import { Handler, Request, Response } from 'express';
import Joi from 'joi';
import { Application, PathParams } from '../node_modules/@types/express-serve-static-core';

export const asyncHandler = (handler: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response) => {
    handler(req, res)
      .catch((e) => {
        console.error('error occured: ', e);
        res.sendStatus(500);
      });
  };
};

export const validationHandler = (validator: Joi.Schema, next: (req: Request, res: Response) => void): Handler => {
  return (req, res) => {
    const validationResults = validator.validate(req.body, {
      abortEarly: false,
    });

    if (validationResults.error) {
      res.status(400).send({
        details: validationResults.error.details,
        isValidationError: true,
      });

      return;
    }

    next(req, res);
  };
};

export const ensureValidRoute = (route: PathParams): void => {
  if (typeof route === 'string') {
    if (route[0] !== '/') {
      throw new Error(`Route ${route} is invalid, all routes must start with a leading slash /`);
    }
  }
};

export const postValidatedAsync = (app: Application, route: PathParams, schema: Joi.Schema, handler: (req: Request, res: Response) => Promise<any>) => {
  console.log(`initializing POST ${route.toString()} with validation`);
  ensureValidRoute(route);
  app.post(route, validationHandler(schema, asyncHandler(handler)));
};

export const getAsync = (app: Application, route: PathParams, handler: (req: Request, res: Response) => Promise<any>) => {
  console.log(`initializing GET ${route.toString()} without validation`);
  ensureValidRoute(route);
  app.get(route, asyncHandler(handler));
};
