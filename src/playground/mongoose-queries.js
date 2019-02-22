const { ObjectID } = require('mongodb');

require('../db/mongoose');

const { Todo } = require('../models/TodoSchema');

const id = "5c6f38330f8b22b015a36fd0";
const invalidId = "612c6f38330f8b22b015a36fd0";



if(!ObjectID.isValid(invalidId))
  console.log('This id is not valid');

Todo.find({
  _id : id
}).then(todos => {
    console.log('Todos', todos);
}).catch(err => {
    console.log(err);
});

Todo.findOne({
    _id : id
  }).then(todo => {
      console.log('Todo', todo);
  }).catch(err => {
      console.log(err);
  });

Todo.findById(id).then(todo => {
  console.log(todo);
});

Todo.findById(invalidId).then(todo => {
    console.log(todo);
  }).catch(err => {
      console.log('id invalid!');
  });

Todo.findOne({})
  .then(one => {
    console.log('one', one);
  });