import { Request, Response } from "express";

export const asyncHandler = (handler: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response) => {
    handler(req, res)
      .catch((e) => {
        console.error('error occured: ', e);
        res.sendStatus(500);
      })
  }
}
