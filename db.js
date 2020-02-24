const { Client } = require("pg");
var crypto = require("./crypto.js");
let DBclient = new Client({
  user: "mbrvghkljmubyo",
  host: "ec2-54-246-89-234.eu-west-1.compute.amazonaws.com",
  database: "d48571o9ql6qjg",
  password: "c2a68138fa7b1fd8a10e50afeb9abc302ad1d74030c86e6b4a1f0721e7e5a902",
  port: 5432,
  ssl: true
});

function init() {
  DBclient.connect();
}

const schemaName = "project";

function getUsers() {
  let query1 = "select * from " + schemaName + ".users";
  return new Promise(function (resolve, reject) {
    DBclient.query(query1, function (err, result) {
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

function addUser(username, userPsw) {
  console.log(username, userPsw)
  var encryptedPsw1 = crypto.encryptPsw(userPsw);
  let userPromise = this.getUsers();
  return new Promise(function (resolve, reject) {
    userPromise.then(result => {
      let userExistance = false;
      if (result.length > 0) {
        result.forEach(user => {
          if (user.email == username) {
            userExistance = true;
          }
        });
        if (userExistance) {
          console.log(`The user is aleady exist!`);
          resolve(false);
        } else {
          let query = `INSERT INTO ${schemaName}.users (email, password) VALUES ('${username}', '${encryptedPsw1}');`;

          DBclient.query(query, function (err, result) {
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

function isUserOK(username, userPsw) {
  console.log(userPsw)
  let query = `select email, password  from ${schemaName}.users where email='${username}'`;
  return new Promise(function (resolve, reject) {
    DBclient.query(query, function (err, result) {
      if (err) {
        console.log(err.stack);
        return reject(err);
      } else {
        if (result.rowCount > 0) {
          var decryptPsw1 = crypto.decryptPsw(
            result.rows[0].password
          );
          console.log(decryptPsw1 + userPsw)
          if (decryptPsw1 == userPsw) {
            console.log(`${result.rows[0].email} connected!`);
            return resolve(true);
          }
        }
      }
      console.log(`Wrong password or username!`);
      return resolve(false);
    });
  });
}

function importData(user_email, res) {

  let query = `SELECT * FROM ${schemaName}.data1 WHERE email='` + user_email + `'`
  // let query = `select *  from ${schemaName}.data1`;
  DBclient.query(query).then(results => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results.rows));
    // res.writeHead(200, {'Content-Type': 'application/json'});
    // res.end(JSON.stringify(reults.rows));

  }).catch(() => {
    console.error("DB failed in attempt");
  });

}
function getPassword(user_email, res) {
  let query = `select email, password  from ${schemaName}.users where email='${user_email}'`;
  DBclient.query(query, function (err, result) {
    if (err) {
      console.log(err.stack);
      return reject(err);
    }
    else {
      if (result.rowCount > 0) {
        var decryptPsw1 = crypto.decryptPsw(
          result.rows[0].password
        );
        return decryptPsw1;
      }
    }
  });
}
  
module.exports.getPassword = getPassword;
module.exports.addUser = addUser;
module.exports.getUsers = getUsers;
module.exports.init = init;
module.exports.isUserOK = isUserOK;
module.exports.importData = importData;