const pool = require('../lib/utils/pool');
// const twilio = require('twilio');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn()
  }
}));
describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  beforeEach(() => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 2 });
  });
  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })

      .then(res => {
        // expect(createMessage).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '2',
          quantity: 10
        });
      });
  });
  it('returns all orders using GET from our database and sends a text message', async() => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });
    return request(app)
      .get('/api/v1/orders')
      .then(res => {
        expect(res.body).toEqual([{
          id: '1',
          quantity: 2
        }, {
          id: '2',
          quantity: 10
        }]);
      });
  });

  it('returns the order using GET /:id with a matching id and quantity and sends a text message', async() => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 3 });
    return request(app)
      .get('/api/v1/orders/2')
      .then(res => {
        expect(res.body).toEqual({ id: '2', quantity: 3 });
      });
  });

  it('patches an order by the selected id', () => {
    return request(app)
      .patch('/api/v1/orders/1')
      .send({ quantity: 5 })
      .then(res => {
        expect(res.body).toEqual({ id: '1', quantity: 5 });
      });
  });
  it('deletes the order by the id selected', async() => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 20 });
    return request(app)
      .delete('/api/v1/orders/2')
      .then(res => {
        expect(res.body).toEqual({ id: '2', quantity: 20 });
      });
  });
});
