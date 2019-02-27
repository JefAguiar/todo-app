require('../db/mongoose');
const { Todo } = require('../models/TodoSchema')

Todo.create({ text: 'New One hehe' }).then(value => {
    Todo.findByIdAndRemove(value._id, (err, res) => {
        console.log('removed ', res);
    });
});

//Todo.remove({});
//Todo.findOneAndRemove();
//Todo.findByIdAndRemove();