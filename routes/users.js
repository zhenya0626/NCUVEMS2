var express = require('express');
var router = express.Router();


const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'F@1ryP3n9u1n',
    database : 'vems'
});


connection.connect();



/* GET users listing. */
router.get('/', function(req, res, next) {

  let sql = `select * from user;`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('test_user', rows);
    res.send(rows);
  });
});
router.get('/:id', function(req, res, next) {

  let sql = `select * from user where userId = ${req.params.id};`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('test_user', rows);
    res.send(rows);
  });
});
router.post('/addcount/:id', function(req, res, next) {

  let sql = `select * from user;`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('test_user', rows);
    res.send(rows);
  });
});


module.exports = router;
