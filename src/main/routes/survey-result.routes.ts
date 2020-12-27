import { makeSaveSurveyResultController } from './../factories/controllers/survey-result/save-survey-result/save-survey-controller-factory';
import { Router } from 'express';
import { adaptRoute } from '@/main/adpters/express-route-adapter';
import { auth } from '@/main/middlewares/auth';

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()));
} 