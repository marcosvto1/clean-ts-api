import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('SignUp Route', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  })

  test('Should return an account on sucess', async () => {
    await request(app)
        .post('/api/signup')
        .send({
          name: 'Marcos',
          email: 'marcosvto1@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200);
   });
})