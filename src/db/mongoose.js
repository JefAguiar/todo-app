const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    useMongoClient: true
});

module.exports.mongoose = mongoose;