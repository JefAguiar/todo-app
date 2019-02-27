const _ = require('lodash');
const { ObjectID } = require('mongodb');
const { Todo } = require('../models/TodoSchema');
const { authMiddleware } = require('../middleware/authMiddleware');

module.exports = app => {
    app.post('/todos', authMiddleware, async (req, res) => {
        try {
            const todo = await new Todo({ text: req.body.text, _creator: req.user._id }).save();
            res.send(todo);
        }
        catch (err) {
            res.status(400).send(err);
        }
    });

    app.get('/todos',authMiddleware, async (req, res) => {
        try {
            const todos = await Todo.find({ _creator: req.user._id });
            res.send({ todos });
        }
        catch (err) {
            res.status(400).send();
        }
    });

    app.get('/todos/:id', authMiddleware, async (req, res) => {
        const { id } = req.params;

        try {
            if (!ObjectID.isValid(id)) {
                return res.status(404).send();
            }

            const todo = await Todo.findOne({ _id: id, _creator: req.user._id });

            if (todo) {
                res.send({ todo });
            }
            else {
                res.status(404).send();
            }

        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.patch('/todos/:id',authMiddleware, async (req, res) => {
        const { id } = req.params;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        const body = _.pick(req.body, ['text', 'completed']);
        body._creator = req.user._id;

        if (_.isBoolean(body.completed) && body.completed)
            body.completedAt = new Date().getTime();
        else {
            body.completed = false;
            body.completedAt = null;
        }

        try {
            const todo = await Todo.findOneAndUpdate(id, { $set: body }, { new: true });

            if (!todo)
                return res.status(404).send();

            return res.send({ todo });

        } catch (err) {
            return res.status(400).send();
        }
    });

    app.delete('/todos/:id', authMiddleware, async (req, res) => {
        const { id } = req.params;

        try {
            if (!ObjectID.isValid(id)) {
                return res.status(404).send();
            }

            const todo = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id  });

            if (todo) {
                return res.send({ todo });
            }
            else {
                return res.status(404).send();
            }

        } catch (err) {
            res.status(400).send(err);
        }
    });
};