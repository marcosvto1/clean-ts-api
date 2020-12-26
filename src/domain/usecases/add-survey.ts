import { SurveyAnswer, SurveyModel } from './../models/survey';

export type AddSurveyModel = {
  question: string;
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>;
}