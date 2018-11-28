var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var https = require('https');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'F@1ryP3n9u1n',
  database : 'vems'
});
connection.connect();

let test = true;
const HOST = 'api.line.me'; 
const REPLY_PATH = '/v2/bot/message/reply';//リプライ用
const PUSH_PATH = '/v2/bot/message/push';
const MULTICAST_PATH = '/v2/bot/message/multicast';
const CH_SECRET_old = 'bc7d4dcadfed59988d014082bd5a46ee'; //Channel Secretを指定
const CH_SECRET = 'c5cc40444c00f1059d17769575ad97b2'; //Channel Secretを指定
const CH_ACCESS_TOKEN_old = 'lUZF7+QLCwbNu4dONhfI9V9Ov+BHIIYOT7LwAspY0+6rb/+AiNCfGR7tjtLUXzysKHiyxb81aYZQ4Mdl/WeWk1SofCWueoZtVH4SbKeMpKihhZRxwRsBb+MmuLwpzJBu1VYzdWf0R2FWbkOkqJMslAdB04t89/1O/w1cDnyilFU='; //Channel Access Tokenを指定
const CH_ACCESS_TOKEN = 'saYoa7C1X1OjCgNMYv9aVbS6un73bMXRaHWgcw/ODHCLES7sxXsGmJaI22fyo8DCl3XmI77uvhVDo6LQXlOtXIzCmGuHqXmE1o1uIaNOPEvtqxIACdNG3QX0KuXnkZl+/td/EbZh3Jis4POpYVFqYQdB04t89/1O/w1cDnyilFU='; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);


/*
 * httpリクエスト部分
 */

const multicastClientSendMessage = (users, SendMessageObject) => {

  let postDataStr = JSON.stringify({ to: users, messages: SendMessageObject });
  let options = {
    host: HOST,
    port: 443,
    path: MULTICAST_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
    }
  };

  return new Promise((resolve, reject) => {
    let req = https.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(body);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });
    req.write(postDataStr);
    req.end();
  });
};
const pushClientSendMessage = (SendMessageObject) => {

  let postDataStr = JSON.stringify({messages: SendMessageObject });
  let options = {
    host: HOST,
    port: 443,
    path: PUSH_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
    }
  };

  return new Promise((resolve, reject) => {
    let req = https.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(body);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });
    req.write(postDataStr);
    req.end();
  });
};
const setAlertedAt = () => {
  let setAlertedAtSql = `update rooms set alerted_at=CURRENT_TIMESTAMP where name='A202';`;
    connection.query(setAlertedAtSql, (err, rows, fields) => {
      if (err) throw err;
    });
}


router.post('/', function(req, res, next) {
  console.log('req.body', req.body);

  let SendMessageObject = req.body.SendMessageObject;
  let userIdArray = req.body.userIdArray;  

  if(test){
    multicastClientSendMessage(['U48d9b4ecccdca65e7b3f44a6910b48af'], SendMessageObject)  //test
    .then((body)=>{
        console.log(body);
    },(e)=>{console.log(e)});
  } else {
    multicastClientSendMessage(userIdArray, SendMessageObject)
    .then((body)=>{
        console.log(body);
    },(e)=>{console.log(e)});
  }

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('success');
});

router.post('/alert', function(req, res, next) {

  let sql = `select userId from user;`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('userId', rows);
    let userIdArray = [];
    rows.forEach(element => {
        userIdArray.push(element.userId);
    });

    let SendMessageObject;   
    SendMessageObject = [
      {
        type: 'text',
        text: '大学内に電気の無駄遣いをしている部屋があります。URLを開いて部屋を確認してください！'
      },
      {
        type: 'text',
        text: 'https://ncuvems.sda.nagoya-cu.ac.jp'
      },
      {
        "type": "template",
        "altText": `確認した部屋の電気を消しに行く場合は『消しに行く』. 消さない場合は『行かない』を選択してください。`,
        "template": {
          "type": "confirm",
          "text": `確認した部屋の電気を消しに行く場合は『消しに行く』. 消さない場合は『行かない』を選択してください。`,
          "actions": [
            {
              "type": "message",
              "label": "消しに行く",
              "text": "消しに行く"
            },
            {
              "type": "message",
              "label": "行かない",
              "text": "行かない"
            }
          ]
        }
      },
    ];
    if(test){
      multicastClientSendMessage(['U48d9b4ecccdca65e7b3f44a6910b48af'], SendMessageObject)  //test
      .then((body)=>{
          console.log(body);
      },(e)=>{console.log(e)});
    } else {
      multicastClientSendMessage(userIdArray, SendMessageObject)
      .then((body)=>{
          console.log(body);
      },(e)=>{console.log(e)});
    }

  });
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('success');
});



module.exports = router;
