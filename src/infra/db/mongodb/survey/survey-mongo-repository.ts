import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { AddSurveyModel } from '@/domain/usecases/survey/add-survey';
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { MongoHelper } from './../helpers/mongo-helper';
import { SurveyModel } from '@/domain/models/survey';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository';
import { ObjectId } from 'mongodb';

interface SurveyRepository extends AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {}

export class SurveyMongoRepository implements SurveyRepository {

  async add(data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(data);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray();
    return MongoHelper.mapCollection(surveys); 
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({_id: new ObjectId(id)})
    return survey && MongoHelper.map(survey); 
  }
}