import { AddSurveyModel } from '@/domain/usecases/add-survey';
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { MongoHelper } from './../helpers/mongo-helper';
import { SurveyModel } from '@/domain/models/survey';

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(data: AddSurveyModel): Promise<void> {
    const mongoCollection = await MongoHelper.getCollection('surveys');
    await mongoCollection.insertOne(data);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const mongoCollection = await MongoHelper.getCollection('surveys');
    const surveys: SurveyModel[] = await mongoCollection.find().toArray();
    return surveys; 
  }
}