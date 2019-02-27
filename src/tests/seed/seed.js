const { Todo } = require('../../models/TodoSchema');
const { User } = require('../../models/UserSchema');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const userId = new ObjectID();
const anotherId = new ObjectID();

const usersMock = [{
    _id: userId,
    email: 'example@ex.com',
    password: '123shouldchange',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
},{
    _id: anotherId,
    email: 'example2@ex.com',
    password: '123anothershouldchange',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: anotherId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];

const todosMock = [{
    text: 'First test todo',
    _id: new ObjectID(),
    _creator: userId
}, {
    text: 'Second test todo',
    _id: new ObjectID(),
    _creator: anotherId
},
{
    text: 'Third test todo',
    _id: new ObjectID(),
    completed: true,
    completedAt: 333,
    _creator: userId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todosMock)
            .then((res, err) => {
                if (err)
                    return done(err);
                return done();
            });
    });
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
      const userOne = new User(usersMock[0]).save();
      const userTwo = new User(usersMock[1]).save();
     return Promise.all([userOne, userTwo]);
     
  }).then(() => done());
};

module.exports = {
    todosMock,
    usersMock,
    populateTodos,
    populateUsers
};
