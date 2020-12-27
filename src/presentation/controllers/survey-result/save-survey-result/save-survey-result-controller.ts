import { serverError } from './../../../helpers/http/http-helper';
import { HttpRequest, HttpResponse, Controller, LoadSurveyById, SaveSurveyResult, forbidden, InvalidParamError } from './save-survey-result-protocols';

export class SaveSurveyResultController implements Controller {
  
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (survey) {
        const answers = survey.answers.map(a => a.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'));
        }
        const surveyResult = await this.saveSurveyResult.save({ 
          surveyId, 
          accountId, 
          answer, 
          date: new Date() 
        });      
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }
      return null;
    } catch (error) {
      return serverError(new Error(error))
    }
  }
}