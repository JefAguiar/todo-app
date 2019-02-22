const { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://mongoadmin:mongoadmin@localhost:17017',(err, client) => {
  if(err){
      return console.log('Unable to connect to MongoDb server');
  }
  console.log('Connected to MongoDb server');

  const db = client.db('todo-db');
  db.collection('todos')
    .insertOne({
      text: 'Test'
    }, (err, result) => {
      if(err){
        console.log(err);
        return console.log('Unable to insert todo');
      }
        
      console.log(JSON.stringify(result.ops, undefined, 2))
    });

    db.collection('users').insertOne({
        name: 'Jeferson',
        age: 25,
        location: 'Brazil'
    }, (err, result) => {
      if(err){
          console.log(err);
          return console.log('Unable to insert user');
      }

      console.log(JSON.stringify(result.ops, undefined, 2));
    });

  client.close();
});