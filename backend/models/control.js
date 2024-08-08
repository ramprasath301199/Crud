const express = require("express");
const router = express.Router();
const connection = require("./connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const { config } = require("dotenv");
//const verify = require("jwt-check-expiration");
//var morgan = require('morgan');
const saltrounds = 10;
var password = "";
// function verify(req, res, next) {
//   var header = req.headers["Autorization"];
//   if (typeof header !== "undefined") {
//     const bearer = header.split("");
//     const bearertoken = bearer[1];
//     req.token = bearertoken;
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// }
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //res.end();
  next();
});
router.get("/", (req, res) => {
  //console.log(morgan("combined"));
  res.send("hi");
  
});

router.post("/login", (req, res) => {
  console.log(req.body);
  connection.query(
    `SELECT * FROM usersdata where name = '${req.body[0].name}'`,
    (err, result) => {
      if (!err) {
        console.log("res",result);
        console.log(req.body[0].password);
        bcrypt.compare(
          req.body[0].password,
          result[0].password,
          (err, data) => {
            if (!err) {
              console.log(data);
              if (data) {
                const user = result;
                jwt.sign(
                  { user: user },
                  "secret",
                  { expiresIn: "24h" },
                  (err, token) => {
                    if (!err) {
                      console.log(token);
                      res.send([{ token, name: result[0].name }]);
                    } else {
                      console.log(err);
                      res.send(err);
                    }
                  }
                );
              } else {
                console.log(data);
                res.send("login failed");
              }
            } else {
              console.log(err);
              res.send(err);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});
router.post("/signup", (req, res) => {
  console.log(req.body[0].email);
  connection.connect((err) => {
    if (!err) {
      console.log("db connected");
      //   connection.query(
      //     "CREATE TABLE usersdata (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255),email VARCHAR(255), password VARCHAR(255),mobile VARCHAR(10))",
      //     (err) => {
      //       if (!err) {
      //         console.log("table created");
      //       } else {
      //         console.log(err);
      //       }
      //     }
      //   );
      //   connection.query(
      //     `INSERT INTO usersdata (name, address, email, mobile, password) VALUES ('${req.body[0].name}','${req.body[0].address}','${req.body[0].email}','${req.body[0].mobile}','${req.body[0].password}')`,
      //     (err, result) => {
      //       if (!err) {
      //         console.log(result);
      //         res.send(result);
      //       } else {
      //         res.send(err);
      //       }
      //     }
      //   );
      bcrypt
        .hash(req.body[0].password, saltrounds)
        .then((hash) => {
          connection.query(
            `UPDATE usersdata SET address = '${req.body[0].address}' ,email = '${req.body[0].email}' ,mobile ='${req.body[0].mobile}' , password = '${hash}'  WHERE name = '${req.body[0].name}' `,
            (err, reult) => {
              if (!err) {
                console.log(reult.affectedRows);
                if (reult.affectedRows == 0) {
                  console.log(hash);
                  connection.query(
                    `INSERT INTO usersdata (name, address, email, mobile, password) VALUES ('${req.body[0].name}','${req.body[0].address}','${req.body[0].email}','${req.body[0].mobile}','${hash}')`,
                    (err, result) => {
                      if (!err) {
                        console.log(result);
                        res.send("success");
                      } else {
                        res.send(err);
                      }
                    }
                  );
                } else {
                  res.send("success");
                }
              } else {
                res.send(err);
                console.log(err);
              }
            }
          );
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      console.log(err);
    }
  });
});
router.use((req, res, next) => {
  var header = req.headers.authorization;
  if (typeof header !== "undefined") {
    // //console.log("inside");
    const bearer = header.split(" ")[1];
   // console.log(bearer);
    //console.log(bearer);
    //     // req.token = bearertoken;
    //     //console.log(req.token);
    //     //console.log();verify(bearertoken);
    //   //  const token = jwt.decode(bearer);
    //   //  console.log((token.exp - token.iat)/60 +"min");\
    jwt.verify(bearer,"secret",(err,result)=>{
      if(!err){
        next();
      }else{
        console.log(err);
        res.sendStatus(403);
      }
    })
  } else {
    res.sendStatus(403);
  }
});
router.get("/details", (req, res) => {
  // res.send("home page");
  connection.query("select * from details", (err, result) => {
    if (!err) {
      console.log(result);
      res.send(result);
    } else {
      console.log(err);
    }
  });
});
router.post("/update", (req, res) => {
  console.log(req.body);
  connection.connect((err) => {
    if (!err) {
      console.log("db connected");
      connection.query(
        `UPDATE details SET Address = '${req.body.Address}' ,Mobile ='${req.body.Mobile}' ,LastName = '${req.body.LastName}',name = '${req.body.name}'   WHERE Id=${req.body.Id}`,
        (err, result) => {
          if (!err) {
            res.send("success");
            console.log(result);
          } else {
            console.log(err);
            res.send("failed");
          }
        }
      );
    } else {
      res.send(err);
    }
  });
});
router.post("/newdata", (req, res) => {
  //console.log(req.body);
  connection.connect((err) => {
    if (!err) {
      //res.send("db connected")
      console.log("db connected");
      connection.query(
        `SELECT * FROM details WHERE name='${req.body[0].name}'`,
        (err, result) => {
          if (!err) {
            var a = result;
            if (!result.length) {
              console.log("true");
              connection.query(
                `INSERT INTO details (name, Address, Mobile,LastName) VALUES ('${req.body[0].name}','${req.body[0].Address}','${req.body[0].Mobile}','${req.body[0].LastName}')`,
                (err, data) => {
                  if (!err) {
                    res.send("create Successfully");
                  } else {
                    res.send(err);
                    console.log(err);
                  }
                }
              );
              // res.send(result);
            } else {
              console.log("false");
              res.send("already registerd");
            }
          } else {
            res.send(err);
          }
        }
      );
    } else {
      res.send(err);
      console.log(err);
    }
  });
});
router.post("/delete", (req, res) => {
  //res.send("delete");
  console.log(req.body);
  connection.connect((err) => {
    if (!err) {
      console.log("db connected");
      connection.query(
        `DELETE FROM details WHERE Id=${req.body.Id}`,
        (err, result) => {
          if (!err) {
            res.send("success");
          } else {
            res.send(err);
          }
        }
      );
    } else {
      res.send(err);
    }
  });
});

module.exports = router;
