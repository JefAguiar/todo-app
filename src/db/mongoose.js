const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:17017/todo-db?authSource=admin", {
    user: 'mongoadmin',
    pass: 'mongoadmin',
    useMongoClient: true
});

module.exports.mongoose = mongoose;