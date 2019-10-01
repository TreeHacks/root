import { Request, Response } from 'express';
import { getApplicationAttribute, setApplicationAttribute } from "./common"

// export function getApplicationInfo(req: Request, res: Response) {
//   return getApplicationAttribute(req, res, e => e.forms.application_info);
// }

// todo: auth to only admins
export function setAdminInfo(req: Request, res: Response) {
  return setApplicationAttribute(req, res,
    e => e.admin_info = req.body,
    e => e.admin_info
  );
}