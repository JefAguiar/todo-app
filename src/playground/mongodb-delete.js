const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://mongoadmin:mongoadmin@localhost:17017', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDb server');

    const db = client.db('todo-db');

    db.collection('todos')
        .deleteMany({
            text: 'Tests'
        }).then(result => {
            console.log(result);
        }, err => {
            console.log(err);
        });

    db.collection('todos')
        .findOneAndDelete({
            text: 'Test'
        }).then(result => {
            console.log(result);
        }, err => {

        });

    client.close();

});

