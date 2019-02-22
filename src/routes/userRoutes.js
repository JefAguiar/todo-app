const { User } = require('../models/UserSchema');

module.exports = app => {
    app.post('/users', async (req, res) => {
        try {
            const user = await new User(req.body).save();
            res.send(user);
        }
        catch (err) {
            res.status(400).send(err);
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
};