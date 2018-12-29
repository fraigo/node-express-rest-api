const DBSOURCE = 'data/db.sqlite'; // ':memory:' for in-memory database

var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');


function migrate(db){
    db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,(err) => {
        if (err) {
            // Table already created
            //console.error("ERROR:", err.message);
        }else{
            // Table just created, creating some rows
            db.run('INSERT INTO user (name, email, password) VALUES (?,?,?)',["admin","admin@example.com",md5("admin123456")]);
            db.run('INSERT INTO user (name, email, password) VALUES (?,?,?)',["user","user@example.com",md5("user123456")]);
        }
    });

    db.run(`CREATE TABLE token (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token text, 
        email text, 
        expires long 
        )`,(err) => {
            if (err) {
                // Table already created
                // console.error("ERROR:", err.message);
            }else{
                // Table just created, creating initial rows
            }
        }
    );
}

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err
    }else{
        console.log('Connected to the %DB% SQlite database.'.replace("%DB%",DBSOURCE));
        migrate(db)    
    }
});


module.exports = db;

