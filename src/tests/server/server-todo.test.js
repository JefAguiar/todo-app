const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../../index');
const { Todo } = require('../../models/TodoSchema');

const todosMock = [{
  text: 'First test todo',
  _id: new ObjectID()
}, {
  text: 'Second test todo',
  _id: new ObjectID()
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todosMock)
      .then((res, err) => {
        if (err)
          return done(err);
        return done();
      });
  });
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {

    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => expect(res.body.text).toBe(text))
      .end((err, res) => {

        if (err)
          return done(err);

        Todo.find({ text }).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();

        }).catch(err => done(err));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err)
          return done(err);

        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        }).catch(err => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get todo by id', done => {
    request(app)
      .get(`/todos/${todosMock[0]._id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo).toInclude(todosMock[0])
      })
      .end(done);
  });

  it('should return 404 if not found', done => {
    request(app)
      .get(`/todos/${todosMock[0]._id}1`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid id', done => {
    request(app)
      .get(`/todos/1231`)
      .expect(404)
      .end(done);
  });
});