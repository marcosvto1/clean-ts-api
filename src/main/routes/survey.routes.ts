import { adaptMiddleware } from './../adpters/express-middleware-adapter';
import { makeAuthMiddleware } from './../factories/middlewares/auth-middleware-factory';
import { Router } from 'express';
import { adaptRoute } from '../adpters/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
} 