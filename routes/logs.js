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

  let sql = `select distinct logs.created_at,
    logs.is_server,
    logs.type,logs.message,
    user.displayName,
    logs.room_state_prev as rp,
    logs.room_state_next as rn ,
    logs.memo
    from logs left outer join user on logs.userId = user.userId order by logs.created_at DESC;`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('test_user', rows);
    res.send(rows);
    // res.render('logs', {
    //   logs: JSON.stringify(rows),
    // });
  });
});


module.exports = router;
