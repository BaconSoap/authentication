import { Request, Response } from 'express';
import Joi from 'joi';
import { Application, PathParams } from '../node_modules/@types/express-serve-static-core';
import { createJwtMiddleware } from '../util/jwtHelpers';

export type UserFromJwt = {
  email: string,
  sub: number,
};

export type UserMaybeEnhancedRequest = Request & {
  user?: UserFromJwt,
};

export type UserEnhancedRequest = Request & {
  user: UserFromJwt,
};

export const asyncHandler = (handler: (req: UserMaybeEnhancedRequest | UserEnhancedRequest, res: Response) => Promise<void>) => {
  return (req: UserMaybeEnhancedRequest, res: Response) => {
    handler(req, res)
      .catch((e) => {
        console.error('error occured: ', e);
        res.sendStatus(500);
      });
  };
};

export const validationHandler = (validator: Joi.Schema, next: (req: UserMaybeEnhancedRequest | UserEnhancedRequest, res: Response) => void) => {
  return (req: UserMaybeEnhancedRequest, res: Response) => {
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

export const postValidatedAsync = (app: Application, route: PathParams, schema: Joi.Schema, handler: (req: UserMaybeEnhancedRequest, res: Response) => Promise<any>) => {
  console.log(`initializing POST ${route.toString()} with validation`);
  ensureValidRoute(route);
  app.post(route, validationHandler(schema, asyncHandler(handler)));
};

export const getAsync = (app: Application, route: PathParams, handler: (req: UserMaybeEnhancedRequest, res: Response) => Promise<any>) => {
  console.log(`initializing GET ${route.toString()} without validation`);
  ensureValidRoute(route);
  app.get(route, asyncHandler(handler));
};

export const getAuthenticatedAsync = (app: Application, route: PathParams, handler: (req: UserEnhancedRequest, res: Response) => Promise<any>) => {
  console.log(`initializing GET ${route.toString()} without validation and authentication`);
  ensureValidRoute(route);
  app.get(route, createJwtMiddleware(), asyncHandler(handler as any));
};
