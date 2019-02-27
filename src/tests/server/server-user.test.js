const expect = require('expect');
const request = require('supertest');
const { populateUsers, usersMock } = require('../seed/seed');
const { app } = require('../../index');
const { User } = require('../../models/UserSchema');

beforeEach(populateUsers);

describe('GET /users/me', () => {
  it('should return a user if authenticated', (done) => {
    request(app)
       .get('/users/me')
       .set('x-auth', usersMock[0].tokens[0].token)
       .expect(200)
       .expect(res => {
         expect(res.body.user._id).toBe(usersMock[0]._id.toHexString());
         expect(res.body.user.email).toBe(usersMock[0].email);
       }).end(done);
  });

  it('should return 401 if not authenticated', done => {
     request(app)
       .get('/users/me')
       .expect(401)
       .expect(res => {
         expect(res.body).toEqual({});
       })
       .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    var email = 'examples@examples.com';
    var password = '123mudars';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
          expect(res.body.user.email).toBe(email);
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body.user._id).toBeTruthy();
      })
      .end(err => {
          if(err)
            return done(err);

          User.findOne({
              email
          }).then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            return done();
          })
          .catch(err => done(err));
          
      });
  });

  it('should return validation errors if request invalid', done => {
    request(app)
      .post('/users')
      .send({ email: 'jef.com', password: '123' })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in user', done => {
   request(app)
     .post('/users')
     .send(usersMock[0])
     .expect(400)
     .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
     request(app)
       .post('/users/login')
       .send(usersMock[1])
       .expect(200)
       .expect(res => {
         expect(res.body.user.email).toBe(usersMock[1].email);
         expect(res.body.password).not.toBe(usersMock[1].password);
         expect(res.headers['x-auth']).toBeTruthy();
       })
       .end((err, success) => {
         done(err);
       });
  });

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({ email: usersMock[0].email, password: 'anotherOne' })
      .expect(400)
      .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', usersMock[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(usersMock[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  }); 
});
