import { serverError, noContent } from '@/presentation/helpers/http/http-helper';
import { ok } from '@/presentation/helpers/http/http-helper';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { HttpRequest, HttpResponse, Controller } from './load-surveys-controller-protocols';

export class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return surveys.length ? ok(surveys): noContent();
    } catch (error) {
      return serverError(new Error(error));
    }
  }
}