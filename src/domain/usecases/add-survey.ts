import { SurveyAnswer, SurveyModel } from './../models/survey';

export interface AddSurveyModel {
  question: string;
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>;
}