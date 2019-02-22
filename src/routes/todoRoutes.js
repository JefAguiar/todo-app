const { ObjectID } = require('mongodb');
const { Todo } = require('../models/TodoSchema');

module.exports = app => {
    app.post('/todos', async (req, res) => {
        try {
            const todo = await new Todo(req.body).save();
            res.send(todo);
        }
        catch (err) {
            res.status(400).send(err);
        }
    });

    app.get('/todos', async (req, res) => {
        try {
            const todos = await Todo.find();
            res.send({ todos });
        }
        catch (err) {
            res.status(400).send();
        }
    });

    app.get('/todos/:id',async (req, res) => {
        try {
            if (!ObjectID.isValid(req.params.id)) {
                return res.status(404).send();
            }

            const todo = await Todo.findById(req.params.id);
            res.status(todo && 200 || 404)
               .send(todo && { todo } || todo);

        } catch (err) {
            res.status(400).send(err);
        }
    });
};