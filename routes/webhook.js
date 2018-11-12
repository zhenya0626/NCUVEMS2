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
const clientSendMessage = (replyToken, SendMessageObject) => {

    let postDataStr = JSON.stringify({ replyToken: replyToken, messages: SendMessageObject });
    let options = {
        host: HOST,
        port: 443,
        path: REPLY_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Line-Signature': SIGNATURE,
            'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
            'Content-Length': Buffer.byteLength(postDataStr)
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
const clientGetProfile = (userId) => {
    let options = {
        host: HOST,
        port: 443,
        path: `/v2/bot/profile/${userId}`,
        method: 'GET',
        headers: {
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
        // req.write(postDataStr);
        req.end();
    });
};

const PostAlert = function () {
    let options = {
        host: 'ncuvems.sda.nagoya-cu.ac.jp',
        port: 443,
        path: `/alert`,
        method: 'POST',
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
        // req.write(postDataStr);
        req.end();
    });
};


router.get('/', function(){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('');
});

/*  POST webhook listing. */
router.post('/', function(req, res, next) {
  let body = req.body;
  if(body === ''){
    console.log('bodyが空です。');
    return;
  }
  let WebhookEventObject = body.events[0];
  console.log('WebhookEventObject', WebhookEventObject);
  let SendMessageObject;   
  //メッセージが送られて来た場合

  
  if(WebhookEventObject.type === 'message'){
    replyTokenArray.push(WebhookEventObject.replyToken);
    const userId = WebhookEventObject.source.userId;

    UIDArray.push(userId);
    if(WebhookEventObject.message.type === 'text'){
        if (WebhookEventObject.message.text === '送信') {
            PostAlert().then((body)=>{
                console.log(body);
            },(e)=>{console.log(e)});
        }
         else if (WebhookEventObject.message.text === '消しに行く') {
            SendMessageObject = [{
                "type": "template",
                "altText": "消した場合は『消した』 使っている人がいたなど消せなかった場合は『消せなかった』を選択してください",
                "template": {
                    "type": "confirm",
                    "text": "消した場合は『消した』 使っている人がいたなど消せなかった場合は『消せなかった』を選択してください",
                    "actions": [
                        {
                            "type": "message",
                            "label": "消せなかった",
                            "text": "消せなかった"
                        },
                        {
                            "type": "message",
                            "label": "消した",
                            "text": "消した"
                        }
                    ]
                }
                }];
            clientSendMessage(WebhookEventObject.replyToken, SendMessageObject)
            .then((body)=>{
                console.log(body);
            },(e)=>{console.log(e)});
        } else if (WebhookEventObject.message.text === '消した') {



            // kokode kietakadouka kakuninnsuru

            let sql = `update user set count = count + 1 where userId='${userId}';`;   
            connection.query(sql, (err, rows, fields) => {
                if (err) throw err;
                console.log('te!!!!!!!!!!!!!!!!!st_user', rows);
                // let sql3 = `select * from user where userId='${userId}';`;  
                let sql2 = `select *, (select count(*) + 2 from user b where b.count > a.count) as ranking from user a where userId='${userId}';`;  
                    connection.query(sql2, (err, rows, fields) => {
                    if (err) throw err;
                    console.log('test_user!!!!!!!!!!!!!!!???????????????', rows);
                    SendMessageObject = [{
                        type: 'text',
                        text: 'ありがとうございます!!'
                    },{
                        type: 'text',
                        text: `ランキング ${rows[0].ranking}位　現在の獲得ポイントは${rows[0].count*10}Pです。`
                    },{
                        type: 'text',
                        text: 'https://ncuvems.sda.nagoya-cu.ac.jp'
                    }];
                    clientSendMessage(WebhookEventObject.replyToken, SendMessageObject)
                    .then((body)=>{
                        console.log(body);
                    },(e)=>{console.log(e)});
                });
            });
            
            
            
        } else if (WebhookEventObject.message.text === '消せなかった'|| WebhookEventObject.message.text === '消さないで') {
            
            let point = 0;
            if(WebhookEventObject.message.text === '消せなかった'){
                point = 3;
            } else{
                point = 1;
            }
            let sql = `update user set count = count + ${point} where userId='${userId}';`;   
            connection.query(sql, (err, rows, fields) => {
                if (err) throw err;
                console.log('te!!!!!!!!!!!!!!!!!st_user', rows);
                // let sql3 = `select * from user where userId='${userId}';`;  
                let sql2 = `select *, (select count(*) + 1 from user b where b.count > a.count) as ranking from user a where userId='${userId}';`;  
                    connection.query(sql2, (err, rows, fields) => {
                    if (err) throw err;
                    SendMessageObject = [{
                        type: 'text',
                        text: 'ありがとうございます!!'
                    },{
                        type: 'text',
                        text: `ランキング ${rows[0].ranking}位　現在の獲得ポイントは${rows[0].count*10}Pです。`
                    },{
                        type: 'text',
                        text: 'https://ncuvems.sda.nagoya-cu.ac.jp'
                    }];
                    clientSendMessage(WebhookEventObject.replyToken, SendMessageObject)
                    .then((body)=>{
                        console.log(body);
                    },(e)=>{console.log(e)});
                });
            });


            SendMessageObject = [{
                type: 'text',
                text: 'ありがとうございました'
            },{
                type: 'text',
                text: 'https://ncuvems.sda.nagoya-cu.ac.jp'
            }];
            clientSendMessage(WebhookEventObject.replyToken, SendMessageObject)
            .then((body)=>{
                console.log(body);
            },(e)=>{console.log(e)});


            let sql3 = `select userId from user;`;
            connection.query(sql3, (err, rows, fields) => {
              if (err) throw err;
              console.log('userId', rows);
              let userIdArray = [];
              rows.forEach(element => {
                if(element.userId !== userId){
                    userIdArray.push(element.userId);
                }
              });
        
                SendMessageObject = [
                {
                    type: 'text',
                    text: ' 使用している人いたので電気を消さなくても大丈夫です。ありがとうございました。'
                }];
                // multicastClientSendMessage(userIdArray, SendMessageObject)  //sousinnsitahitoigai
                multicastClientSendMessage(['Ud12eabeb5d98614b70d2edbbd9fc67be'], SendMessageObject)  //test
                .then((body)=>{
                    console.log(body);
                },(e)=>{console.log(e)});
            });

        } else if (WebhookEventObject.message.text === '消さない'){

            SendMessageObject = [{
                type: 'text',
                text: 'ありがとうございました'
            },{
                type: 'text',
                text: 'https://ncuvems.sda.nagoya-cu.ac.jp'
            }];
            clientSendMessage(WebhookEventObject.replyToken, SendMessageObject)
            .then((body)=>{
                console.log(body);
            },(e)=>{console.log(e)});


            
        
        } else if (WebhookEventObject.message.text === '登録'){

            const userId = WebhookEventObject.source.userId; 
            
                let displayName = '';
                let pictureUrl = '';
            

                clientGetProfile(userId)
                .then((body)=>{
                    let profile = JSON.parse(body); 
                    displayName = profile.displayName;
                    pictureUrl = profile.pictureUrl;
                    console.log('displayName', displayName);
                    console.log('pictureUrl', pictureUrl);
            
                    let sql = `
                    insert into user (userid, replytoken, displayName, pictureUrl, count)
                    select * from
                    (select '${userId}','${WebhookEventObject.replyToken}','${displayName}','${pictureUrl}',0) as tmp
                    WHERE NOT EXISTS (select id from user where userid = '${userId}');`;
                    
                    connection.query(sql, (err, rows, fields) => {
                        if (err) throw err;
                        console.log('test_user', rows);
                    });
            
                    SendMessageObject = [
                    {
                        type: 'text',
                        text: '登録完了しました。ありがとうございます。' //電気を消siniikuと+10 電気を消すと+10
                    }];
                    clientSendMessage(WebhookEventObject.replyToken, SendMessageObject)
                    .then((body)=>{
                        console.log(body);
                    },(e)=>{console.log(e)});
                },(e)=>{console.log('getprofile noera-',e)});
        }
    }
  } else if(WebhookEventObject.type === 'beacon'){
    // const userId = WebhookEventObject.source.userId;
    // replyTokenArray.push(WebhookEventObject.replyToken);
    // UIDArray.push(userId);


    // let displayName = '';
    // let pictureUrl = '';

    // clientGetProfile(userId)
    // .then((body)=>{
    //     let profile = JSON.parse(body); 
    //     displayName = profile.displayName;
    //     pictureUrl = profile.pictureUrl;
    //     console.log('displayName', displayName);
    //     console.log('pictureUrl', pictureUrl);

    //     let sql = `
    //     insert into user (userid, replytoken, displayName, pictureUrl, count)
    //     select * from
    //     (select '${userId}','${WebhookEventObject.replyToken}','${displayName}','${pictureUrl}',0) as tmp
    //     WHERE NOT EXISTS (select id from user where userid = '${userId}');`;
        
    //     connection.query(sql, (err, rows, fields) => {
    //         if (err) throw err;
    //         console.log('test_user', rows);
    //     });

    //     SendMessageObject = [{
    //         "type": "template",
    //         "altText": `${displayName}さん! 近くに電気の無駄遣いをしている部屋があります。URLを確認して消してください！`,
    //         "template": {
    //             "type": "confirm",
    //             "text": `${displayName}さん! 近くに電気の無駄遣いをしている部屋があります。URLを確認して消してください！`,
    //             "actions": [
    //                 {
    //                     "type": "message",
    //                     "label": "消さないで",
    //                     "text": "消さないで"
    //                 },
    //                 {
    //                     "type": "message",
    //                     "label": "消しに行く",
    //                     "text": "消しに行く"
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         type: 'text',
    //         text: 'https://ncuvems.sda.nagoya-cu.ac.jp'
    //     }];
    //     clientSendMessage(WebhookEventObject.replyToken, SendMessageObject)
    //     .then((body)=>{
    //         console.log(body);
    //     },(e)=>{console.log(e)});

    // },(e)=>{console.log('getprofile noera-',e)});
  }
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('success');
});

module.exports = router;
