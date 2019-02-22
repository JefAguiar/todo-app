const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

const User = mongoose.model('user', userSchema);

module.exports = {
  User
};