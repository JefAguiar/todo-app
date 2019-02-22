const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://mongoadmin:mongoadmin@localhost:17017',(err, client) => {
  if(err){
      return console.log('Unable to connect to MongoDb server');
  }
  console.log('Connected to MongoDb server');
  
  const db = client.db('todo-db');

//   db.collection('users')
//   .find({
//       _id: ObjectID('5c6dca4dc6abe361accf0265')
//   }).toArray().then(docs => {
//     console.log(JSON.stringify(docs));
//   }, err => {
//       console.log('Unable to fetch todos!', err)
//   });

    db.collection('users')
    .count().then(count => {
        console.log('count', count);
    }, err => {
        console.log(err);
    });

  client.close();
});