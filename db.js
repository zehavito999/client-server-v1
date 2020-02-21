const { Client } = require("pg");
var crypto = require("./crypto.js");
let client = new Client({
  user: "mbrvghkljmubyo",
  host: "ec2-54-246-89-234.eu-west-1.compute.amazonaws.com",
  database: "d48571o9ql6qjg",
  password: "c2a68138fa7b1fd8a10e50afeb9abc302ad1d74030c86e6b4a1f0721e7e5a902",
  port: 5432,
  ssl: true
});

function init() {
  client.connect();
}

const schemaName = "project";

function getUsers() {
  let query1 = "select * from " + schemaName + ".users";

  return new Promise(function(resolve, reject) {
    client.query(query1, function(err, result) {
      if (result.rowCount == 0) {
        return resolve([]);
      } else if (err) {
        console.log(err.stack);
        return reject(err);
      } else {
        return resolve(result.rows);
      }
    });
  });
}

function addNewUser(userName, userPassword) {
    console.log(userName,userPassword)
  var encryptedPass = crypto.encryptPassword(userPassword);

  let userPromise = this.getUsers();

  return new Promise(function(resolve, reject) {
    userPromise.then(result => {
      let isUserExist = false;

      if (result.length > 0) {
        result.forEach(user => {
          if (user.email == userName) {
            isUserExist = true;
          }
        });

        if (isUserExist) {
          console.log(`user aleady exist!`);
          resolve(false);
        } else {
          let query = `INSERT INTO ${schemaName}.users (email, password) VALUES ('${userName}', '${encryptedPass}');`;

          client.query(query, function(err, result) {
            if (err) {
              console.log(err.stack);
            }
          });
          resolve(true);
        }
      }
    });
  });
}

function isUserAuthenticate(userName, userPassword) {
    let query = `select email, password  from ${schemaName}.users where email='${userName}'`;
    return new Promise(function(resolve, reject) {
      client.query(query, function(err, result) {
        if (err) {
          console.log(err.stack);
          return reject(err);
        } else {
          if (result.rowCount > 0) {
            var decryptPassword = crypto.decryptPassword(
              result.rows[0].password
            );
            if (decryptPassword == userPassword) {
              console.log(`${result.rows[0].email} connected!`);
              return resolve(true);
            }
          }
        }
        console.log(`worng password or username`);
        return resolve(false);
      });
    });
  }

  function fetchData() {
    let query = `select *  from ${schemaName}.data1`;

    return new Promise(function(resolve, reject) {
      client.query(query, function(err, result) {
        if (err) {
          console.log(err.stack);
          return reject(err);
        } else {
          let allData = [];

          for (let j = 0; j < result.rowCount; j++) {
            var item = result.rows[j];
            allData.push({
              email: item.email,
              data1: item.data1,
              data2: item.data2,
              lat: item.lat,
              long: item.long
            });
          }
          return resolve(allData);
        }
      });
    });
  }

module.exports.addNewUser = addNewUser;
module.exports.getUsers = getUsers;
module.exports.init = init;
module.exports.isUserAuthenticate = isUserAuthenticate;
module.exports.fetchData = fetchData;