import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository';
import { SurveyResultModel } from '@/domain/models/survey-result';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    // options {upsert: true} // caso não encontre algum registro, ele faz a criar de um novo com todos parmetros incluse com a do filter query (primeiro)
    // caso use apenas upsert: true, por padrão o caso encontre no findOne ele retornaŕa o registro da busca mais não o modificado
    const res = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId,
    }, {
      $set: {
        answer: data.answer,
        data: data.date
      }
    }, { upsert: true, returnOriginal: false });

    return res.value && MongoHelper.map(res.value)
  }
}