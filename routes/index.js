var express = require('express');
var router = express.Router();


const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'F@1ryP3n9u1n',
    database : 'vems'
});


/* GET home page. */
router.get('/', function(req, res, next) {

  let sql = `select displayName from user order by updated_at desc limit 1;`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    let data = rows[0].displayName;
    res.render('index', {
      title: 'Express',
      displayName: `${data}さん`,
    });
  });

  
});

module.exports = router;
