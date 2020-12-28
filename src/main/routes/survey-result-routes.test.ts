import { AccountMongoRepository } from './../../infra/db/mongodb/account/account-mongo-repository';
import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Marcos',
    email: 'marcosvto1@gmail.com',
    password: '123'
  });

  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken;
}

describe('Survey Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey without accessToken', async () => {
      await request(app)
        .put(`/api/surveys/any_id/results`)
        .send({
          answer: 'any_answer'
        })
        .expect(403);
    });

    test('Should return 200 on save survey with accessToken', async () => {
      const accessToken = await makeAccessToken();
      const res = await surveyCollection.insertOne({
        question: 'Question 1',
        answers: [
          {
            answer: 'Answer 11',
            image: ''
          },
          {
            answer: 'Answer 21',
          }
        ],
        date: new Date()
      });
      await request(app)
        .put(`/api/surveys/${res.ops[0]._id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 11'
        }).expect(200)

    });
    

  });



})