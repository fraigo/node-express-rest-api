var express = require("express");
var app = express();
var md5 = require('md5');
var config = require("./config.js")


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var db = require("./database.js")
var response = require("./response.js")

var HTTP_PORT = config.HTTP_PORT;
var SESSION_TIMEOUT = config.SESSION_TIMEOUT * 1000;

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT));
});

// Root path
app.get("/", (req, res, next) => {
    res.status(400).json({"message":"Bad Request"});
});

// List users , with filters
app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    var conditions = []
    if (req.query.email){
        conditions.push(" email LIKE ? ")
        params.push(req.query.email) 
    }
    if (req.query.name){
        conditions.push(" name LIKE ? ")
        params.push(req.query.name) 
    }
    if (conditions.length){
        sql += " WHERE " + conditions.join(" AND ")
    }
    response.checkLogin(req, res, (token) => {
        response.SQLRows(res, sql, params)
    })
});

// View user by id
app.get("/api/user/:id", (req, res, next) => {
    response.checkLogin(req, res, (token) => {
        response.SQLRow(res,"select * from user where id = ?", [req.params.id])
    })
});

// Create user
app.post("/api/user/", (req, res, next) => {
    response.checkLogin(req,res,(token) => {
        var data = {
            name: req.body.name,
            email: req.body.email,
            password : md5(req.body.password)
        }
        db.run('INSERT INTO user (name, email, password) VALUES (?,?,?)',[data.name, data.email, data.password], function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            response.SQLRow(res, "select * from user where id = ?", [this.lastID])
        });
    })
})

// Update user
app.patch("/api/user/:id", (req, res, next) => {
    response.checkLogin(req,res,(token) => {
        var data = {
            name: req.body.name,
            email: req.body.email,
            password : req.body.password ? md5(req.body.password) : null
        }
        db.run(
            'UPDATE user set name = coalesce(?,name), email = COALESCE(?,email), password = coalesce(?,password) WHERE id = ?',
            [data.name, data.email, data.password, req.params.id],
            (err, result) => {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                response.SQLRow(res, "select * from user where id = ?", [req.params.id])
        });
    })
})


// Delete user
app.delete("/api/user/:id", (req, res, next) => {
    response.checkLogin(req,res,(token) => {
        db.run(
            'DELETE FROM user WHERE id = ?',
            req.params.id,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({"message":"deleted", rows: this.changes})
        });
    })
})


// Login , get auth token
app.post("/api/auth/login", (req, res, next) => {
    sql = "select * from user where email = ? and password = ? "
    if (!req.body.password){
        res.status(400).json({"error":"No password specified"});
        return;
    }
    params = [req.body.user, md5(req.body.password)]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        if (row){
            var token= md5(row.password + Math.random())
            db.run('INSERT INTO token (token, email, expires) VALUES (?,?,?)',[token,row.email,new Date().getTime() + SESSION_TIMEOUT ]);
            res.json({
                "message":"success",
                "data":{
                    id: row.id,
                    email: row.email,
                    token: token
                }
            })
        }else{
            res.status(404).json({"error":"Not found"})
        }
      });
})


// Get current session info, after login
app.get("/api/auth/me", (req, res, next) => {
    response.checkLogin(req, res, (token) => {
        res.json({
            "message" : "logged",
            "data" : token
        })
    })
})


// Default response
app.use(function(req, res){
    res.status(400);
});

module.exports = app