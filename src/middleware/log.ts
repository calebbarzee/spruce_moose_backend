import {NextFunction, Request, Response} from "express";

export async function logRequestInfo(req: Request, res: Response, next: NextFunction) {
  console.log(`\n****************************************`);
  console.log(`[${req.method}]: ${req.url}`);
  // console.log(`\treq.oidc: ${req.oidc}`);
  if (req.oidc) {
    console.log(`\tIs Authenticated: ${req.oidc.isAuthenticated()}`);
    // console.log(`\tUser from Token: \n${JSON.stringify(req.oidc.user,null, "")}`);
  }
  console.log(`\n`);
  next();
}