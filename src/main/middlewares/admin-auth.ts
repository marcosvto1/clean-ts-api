import { makeAuthMiddleware } from './../factories/middlewares/auth-middleware-factory';
import { adaptMiddleware } from './../adpters/express-middleware-adapter';

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));