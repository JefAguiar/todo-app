const { SHA256 } = require('crypto-js');
const bcrypt = require('bcryptjs');


var message = 'I am user number 3';
var hash = SHA256(message).toString();

const password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    bcrypt.compare(password, hash, (err, succed) => {
      console.log(succed);
    });
  });
});


