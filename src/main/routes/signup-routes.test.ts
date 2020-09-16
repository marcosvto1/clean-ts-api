import request from 'supertest';
import app from '../config/app';

describe('SignUp Route', () => {
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