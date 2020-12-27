import { SurveyMongoRepository } from './survey-mongo-repository';
import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";

let surveyCollection: Collection;

const makeSurvey = () => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  },
  {
    answer: 'other_answer'
  }
],
  date: new Date()
});

describe('Survey Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository();
  }

  test('Should add a survey on success', async () => {
    const sut = makeSut();
    await sut.add(makeSurvey());

    const survey = await surveyCollection.findOne({ question: 'any_question' });

    expect(survey).toBeTruthy();

  });

  describe('loadById', () => {
    test('Should load surveys by id on success', async () => {
      const res = await surveyCollection.insertOne(makeSurvey());
      const sut = makeSut();      
      const survey = await sut.loadById(res.ops[0]._id);
      console.log(survey);
      expect(survey).toBeTruthy();
      expect(survey.id).toBeTruthy();
    });
  })
})