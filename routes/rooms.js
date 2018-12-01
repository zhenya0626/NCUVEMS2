var express = require('express');
var router = express.Router();
var moment = require('moment');


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

  let sql = `select * from rooms;`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('*', rows);
    res.send(rows);
  });
});
router.post('/:id', function(req, res, next) {
  let sql = `select * from rooms where id = ${req.params.id};`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('*', rows);
    res.send(rows);
  });
});
router.post('/:id/state', function(req, res, next) {
    let sql = `update rooms set state = ${req.body.state} where id = ${req.params.id};`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('*', rows);
    res.send(rows);
  });
});
router.get('/:id/isUsed', function(req, res, next) {

  let sql =`select used_at from rooms where id = ${req.params.id};`; 
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    const used_at = moment(rows[0].used_at);
    const nowTime = moment();
    const isUsed = (nowTime.diff(used_at, 'hours') < 1) ? true : false;
    res.send({isUsed: isUsed});
  });
});







module.exports = router;
