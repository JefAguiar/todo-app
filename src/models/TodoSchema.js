const mongoose = require('mongoose');

const { Schema } = mongoose;

const todoSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

const Todo = mongoose.model("todo", todoSchema);

module.exports = {
    Todo 
};