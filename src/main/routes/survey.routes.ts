import { Router } from 'express';
import { adaptRoute } from '@/main/adpters/express-route-adapter';
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory';
import { adminAuth } from '@/main/middlewares/admin-auth';
import { auth } from '@/main/middlewares/auth';
import { makeLoadSurveyController } from '@/main/factories/controllers/survey/load-survey/load-survey-controller-factory';

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()));
} 