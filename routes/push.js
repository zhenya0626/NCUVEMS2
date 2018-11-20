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


const HOST = 'api.line.me'; 
const REPLY_PATH = '/v2/bot/message/reply';//リプライ用
const PUSH_PATH = '/v2/bot/message/push';
const MULTICAST_PATH = '/v2/bot/message/multicast';
const CH_SECRET = 'bc7d4dcadfed59988d014082bd5a46ee'; //Channel Secretを指定
const CH_ACCESS_TOKEN = 'lUZF7+QLCwbNu4dONhfI9V9Ov+BHIIYOT7LwAspY0+6rb/+AiNCfGR7tjtLUXzysKHiyxb81aYZQ4Mdl/WeWk1SofCWueoZtVH4SbKeMpKihhZRxwRsBb+MmuLwpzJBu1VYzdWf0R2FWbkOkqJMslAdB04t89/1O/w1cDnyilFU='; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const replyTokenArray = [];
const UIDArray = [];


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


router.post('/', function(req, res, next) {
  let sql = `select userId from user;`;
  connection.query(sql, (err, rows, fields) => {
    if (err) throw err;
    console.log('userId', rows);
    let userIdArray = [];
    rows.forEach(element => {
      userIdArray.push(element.userId);
    });
  console.log('req', req.body.text);
  let SendMessageObject;   
  SendMessageObject = [
    {
      type: 'text',
      text: req.body.text,
    },
  ];
  // multicastClientSendMessage(userIdArray, SendMessageObject)
  multicastClientSendMessage(['Ud12eabeb5d98614b70d2edbbd9fc67be'], SendMessageObject)  //test

  .then((body)=>{
      console.log(body);
  },(e)=>{console.log(e)});
  });

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
    "altText": `確認した部屋の電気を消しに行く場合は『消しに行く』. 消さない場合は『消さない』を選択してください. その部屋を利用していて電気を消さないでほしい場合は『消さないで』とテキストで送信してください`,
    "template": {
      "type": "confirm",
      "text": `確認した部屋の電気を消しに行く場合は『消しに行く』. 消さない場合は『消さない』を選択してください. その部屋を利用していて電気を消さないでほしい場合は『消さないで』とテキストで送信してください`,
      "actions": [
        {
          "type": "message",
          "label": "消さない",
          "text": "消さない"
        },
        {
          "type": "message",
          "label": "消しに行く",
          "text": "消しに行く"
        }
      ]
    }
  },
  ];
  // multicastClientSendMessage(userIdArray, SendMessageObject)
  multicastClientSendMessage(['Ud12eabeb5d98614b70d2edbbd9fc67be'], SendMessageObject)  //test

  .then((body)=>{
    console.log(body);
  },(e)=>{console.log(e)});

  });


  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('success');
});


module.exports = router;
