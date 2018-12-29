var db = require("./database.js")

// Returns a list of rows
function SQLRows(res,sql,params){
    if (!params){
        params = []
    }
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
}


// Returns a single row
function SQLRow(res,sql,params){
    if (!params){
        params = []
    }
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return
        }
        if (!row){
            res.status(404).json({"error":"Not found"})
            return
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
}

// Parse the Authentication token
function getToken(req){
    var auth = req.headers.authorization
    if ( auth && auth.split(" ").length>1){
        return token = req.headers.authorization.split(" ")[1]
    }else if(req.query.token){
        return req.query.token
    }else{
        return null
    }
}


// Checks if already logged (token not expired)
function checkLogin(req, res, next){
    var token = getToken(req)
    if ( token ){
        var currentTime = new Date().getTime()
        db.get("SELECT email, expires from token where token = ? and expires > ? ",[token,currentTime], (err,row) => {
            if (row){
                next({
                    email : row.email,
                    expires : row.expires,
                    timeout : row.expires - currentTime
                })
            }else{
                res.status(401).json({"error":"Not authenticated"})
            }
        })
    }else{
        res.status(400).json({"error":"Token required"})
    }
}


module.exports = {
    SQLRows,
    SQLRow,
    checkLogin
}