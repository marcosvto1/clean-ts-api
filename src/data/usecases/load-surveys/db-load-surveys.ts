import { SurveyModel } from '@/domain/models/survey';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository';
import { LoadSurveys } from '@/domain/usecases/load-surveys';

export class DbLoadSurveys implements LoadSurveys {
  constructor(
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load(): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll();
    return surveys;
  }
}