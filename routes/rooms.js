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

  let sql = `select * from rooms;`;
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




module.exports = router;
