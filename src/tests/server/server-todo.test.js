const expect = require('expect');
const request = require('supertest');
const { app } = require('../../index');
const { Todo } = require('../../models/TodoSchema');
const { todosMock, populateTodos, usersMock } = require('../seed/seed');

beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {

    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', usersMock[0].tokens[0].token)
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
      .set('x-auth', usersMock[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err)
          return done(err);

        Todo.find().then(todos => {
          expect(todos.length).toBe(3);
          done();
        }).catch(err => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .set('x-auth', usersMock[0].tokens[0].token)
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
      .set('x-auth', usersMock[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect({ _id: res.body.todo._id, text: res.body.todo.text }).toMatchObject({ text: todosMock[0].text, _id: todosMock[0]._id.toHexString() });
      })
      .end(done);
  });

  it('should not return todo doc created by other user', done => {
    request(app)
      .get(`/todos/${todosMock[0]._id}`)
      .set('x-auth', usersMock[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for inexistent id', done => {
    request(app)
      .get(`/todos/6c708640c396642b706635ca`)
      .set('x-auth', usersMock[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {

  it('should return not found id invalid', done => {
    request(app)
      .delete(`/todos/123`)
      .set('x-auth', usersMock[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should delete todo', done => {

    request(app)
      .delete(`/todos/${todosMock[1]._id.toHexString()}`)
      .set('x-auth', usersMock[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(todosMock[1]._id.toHexString())
      })
      .end((err, doc) => {
        if(err)
          return done(err);
         
        Todo.findById(doc.body.todo._id)
          .then(value => {
            expect(value).toBeFalsy();
            done();
          })
          .catch(err => done(err));
      });
  });

  
  it('should not delete a todo which is not mine', done => {

    request(app)
      .delete(`/todos/${todosMock[0]._id.toHexString()}`)
      .set('x-auth', usersMock[1].tokens[0].token)
      .expect(404)
      .end((err, doc) => {
        if(err)
          return done(err);
         
        Todo.findById(todosMock[0]._id.toHexString())
          .then(value => {
            expect(value).toBeTruthy();
            done();
          })
          .catch(err => done(err));
      });
  });

  it('should return not found', done => {
    request(app)
      .delete(`/todos/6c7086404395641b706635ce`)
      .set('x-auth', usersMock[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos', () => {
  it('Should update completedAt to null when completed is not true', done => {
    let updateTo = { text: 'Another Value', completed: true };
    const id  = todosMock[0]._id.toHexString(); 
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', usersMock[0].tokens[0].token)
      .send(updateTo)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(updateTo.text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('Should update the todo', done => {
    const id  = todosMock[0]._id.toHexString();
    let updateTo = { text: 'Another Value', completed: false };
    
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', usersMock[0].tokens[0].token)
      .send(updateTo)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(updateTo.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end((err, res) => {
        done();
      });
  });
  
  it('Should not update the todo which is not mine', done => {
    const id  = todosMock[0]._id.toHexString();
    let updateTo = { text: 'Another Value', completed: false };
    
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', usersMock[1].tokens[0].token)
      .send(updateTo)
      .expect(404)
      .end((err, res) => {
        done();
      });
  });
});