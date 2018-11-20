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
  let sql = `select * from permin;`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('*', rows);
    res.send(rows);
  });
});
router.get('/weekBar', function(req, res, next) {
  let weekBar = {
    lastWeekArray: [],
    thisWeekArray: [],
  }
  let tmpdate = new Date();
  let dayOfWeek = tmpdate.getDay(); 
  dayOfWeek = (dayOfWeek === 0)? 7:dayOfWeek;
  tmpdate.setDate(tmpdate.getDate() - (7 + dayOfWeek -1));
  for (let i = 1; i <= (7 + dayOfWeek); i++) {
    year = tmpdate.getFullYear();    
    mon = tmpdate.getMonth()+1;
    day = tmpdate.getDate() ;	
    let sql = `select day,dayOfTheWeek,sum(ROUND(COALESCE(p1c1,0)+COALESCE(p1c2,0)+
    COALESCE(p1c3,0)+(COALESCE(p1c4,0)+COALESCE(p2c1,0)+COALESCE(p2c2,0)+
    COALESCE(p2c3,0)+COALESCE(p2c4,0)+COALESCE(p3c1,0)+
    COALESCE(p3c2,0)+COALESCE(p3c3,0)+COALESCE(p3c4,0)+
    COALESCE(p4c1,0)+COALESCE(p4c2,0)+COALESCE(p4c3,0))*( 995 / 131.5)*(23.7 / 1000))) as weekBar 
    from permin where year = ${year} and mon = ${mon} and day = ${day} group by day,dayOfTheWeek;`;
    connection.query(sql, (err, rows, fields) => {
      if (err) throw err;
      if (i<=7) {
        weekBar.lastWeekArray[rows[0].dayOfTheWeek-1] = rows[0].weekBar;
      }else if (i>7){
        weekBar.thisWeekArray[rows[0].dayOfTheWeek-1] = rows[0].weekBar;
      }
      if(i === (7+dayOfWeek)){
        res.send(weekBar);
      }
    });
    tmpdate.setDate(tmpdate.getDate() + 1);
  }
});
router.get('/log', function(req, res, next) {
  let log = {
    time: [],
    A202: [],
    A203: [],
    factory: [],
  }
  let sql = `select CONCAT(mon,'/',day,' ',hour,':', min) as time,
  ROUND(COALESCE(p1c1,0)*( 995 / 131.5)*(23.7 / 1000),1) as A202,
  ROUND((COALESCE(p1c2,0)+COALESCE(p1c3,0))*( 995 / 131.5)*(23.7 / 1000),1) as A203,
  ROUND((COALESCE(p1c4,0)+COALESCE(p2c1,0)+COALESCE(p2c2,0)+COALESCE(p2c3,0)+
    COALESCE(p2c4,0)+COALESCE(p3c1,0)+COALESCE(p3c2,0)+COALESCE(p3c3,0)+
    COALESCE(p3c4,0)+COALESCE(p4c1,0)+COALESCE(p4c2,0)+COALESCE(p4c3,0)
    )*( 995 / 131.5)*(23.7 / 1000),1) as factory from permin order by id desc limit 1000;`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    rows.forEach((element ,index) => {
      log.time[index] = element.time;
      log.A202[index] = element.A202;
      log.A203[index] = element.A203;
      log.factory[index] = element.factory;
    });
    res.send(log);
  });
});
router.get('/compare/', function(req, res, next) {

  let now = new Date();
  let year = now.getFullYear();    
  let mon = now.getMonth()+1;
  let day = now.getDate() ;	

  let lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  let lastWeek_year = lastWeek.getFullYear();    
  let lastWeek_mon = lastWeek.getMonth()+1;
  let lastWeek_day = lastWeek.getDate() ;	

  let tmpobj = {
    today: {
      year: year,
      mon: mon,
      day: day,
      time:[],
      A202:[],
      A203:[],
      factory:[]
    },
    lastWeekday: {
      year: lastWeek_year,
      mon: lastWeek_mon,
      day: lastWeek_day,
      time:[],
      A202:[],
      A203:[],
      factory:[]
    }
  };
  let sql = `select CONCAT(hour,':', min) as time,
  ROUND(COALESCE(p1c1,0)*( 995 / 131.5)*(23.7 / 1000),1) as A202,
  ROUND((COALESCE(p1c2,0)+COALESCE(p1c3,0))*( 995 / 131.5)*(23.7 / 1000),1) as A203,
  ROUND((COALESCE(p1c4,0)+COALESCE(p2c1,0)+COALESCE(p2c2,0)+COALESCE(p2c3,0)+
    COALESCE(p2c4,0)+COALESCE(p3c1,0)+COALESCE(p3c2,0)+COALESCE(p3c3,0)+
    COALESCE(p3c4,0)+COALESCE(p4c1,0)+COALESCE(p4c2,0)+COALESCE(p4c3,0))*( 995 / 131.5)*(23.7 / 1000),1) as factory
  from permin where year = ${year} and mon = ${mon} and day = ${day};`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    rows.forEach((element ,index) => {
      tmpobj.today.time[index] = element.time;
      tmpobj.today.A202[index] = element.A202;
      tmpobj.today.A203[index] = element.A203;
      tmpobj.today.factory[index] = element.factory;
    });
      
  });


  let sql2 =  `select CONCAT(hour,':', min) as time,
  ROUND(COALESCE(p1c1,0)*( 995 / 131.5)*(23.7 / 1000),1) as A202,
  ROUND((COALESCE(p1c2,0)+COALESCE(p1c3,0))*( 995 / 131.5)*(23.7 / 1000),1) as A203,
  ROUND((COALESCE(p1c4,0)+COALESCE(p2c1,0)+COALESCE(p2c2,0)+COALESCE(p2c3,0)+
    COALESCE(p2c4,0)+COALESCE(p3c1,0)+ COALESCE(p3c2,0)+COALESCE(p3c3,0)+
    COALESCE(p3c4,0)+COALESCE(p4c1,0)+COALESCE(p4c2,0)+COALESCE(p4c3,0))*( 995 / 131.5)*(23.7 / 1000),1) as factory
  from permin where year = ${lastWeek_year} and mon = ${lastWeek_mon} and day = ${lastWeek_day};`;
  connection.query(sql2, (err, rows, fields) => {
    if (err) throw err;
    rows.forEach((element ,index) => {
      tmpobj.lastWeekday.time[index] = element.time;
      tmpobj.lastWeekday.A202[index] = element.A202;
      tmpobj.lastWeekday.A203[index] = element.A203;
      tmpobj.lastWeekday.factory[index] = element.factory;
    });
    res.send(tmpobj);
  });
});




module.exports = router;
