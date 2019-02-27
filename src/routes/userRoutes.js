const { User } = require('../models/UserSchema');
const { authMiddleware } = require('../middleware/authMiddleware');
const _ = require('lodash');

module.exports = app => {
    app.post('/users', async (req, res) => {
        try {
            var body = _.pick(req.body, ['email', 'password']);
            var user = new User(body);
            const token = await user.generateAuthToken();
            res.header('x-auth', token).send({ user });
        } catch (e) {
            res.status(400).send(e);
        }
    });

    app.get('/users', async (req, res) => {
        try {
            const users = await User.find();
            res.send({ users });

        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.get('/users/me', authMiddleware, async (req, res) => {
       res.send({ user: req.user });
    });

    app.post('/users/login', async (req, res) => {
        var body = _.pick(req.body, ['email', 'password']);
        try {
            let user = await User.findByCredentials(body.email, body.password);  
            const token = await user.generateAuthToken();
            res.header('x-auth', token).send({ user });
 
        } catch (err){
            res.status(400).send({ err });
        };
    });

    app.delete('/users/me/token', authMiddleware, async (req, res) => {
     try {
         
        await req.user.removeToken(req.token);
        res.status(200).send();
     } catch(err){
         res.status(400).send(err);
     };
    });
};