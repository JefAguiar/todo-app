const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://mongoadmin:mongoadmin@localhost:17017',(err, client) => {
  if(err){
      return console.log('Unable to connect to MongoDb server');
  }
  console.log('Connected to MongoDb server');
  
  const db = client.db('todo-db');

//   db.collection('todos')
//   .updateOne(
//       {
//         text: 'Tests'
//       },
//       {
//         text: 'TESTES'
//       }
//   ).then(result => {
//       console.log(result);
//   });
   
     
    //  db.collection('todos')
    //  .findOneAndUpdate({
    //      text: 'TESTES'
    //  }, { text : 'Tests' }).then(result => {
    //    console.log(result);
    //  });

    db.collection('todos')
    .findOneAndUpdate({
        text: 'Teests'
    }, {
        $set: {
           text: 'Tests' 
        },
        $inc: {
            age: 1
        }
    }, { returnOriginal: false }).then(result => {
        console.log(result);
    });

  client.close();
});