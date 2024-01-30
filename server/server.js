const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const jwt = require("jsonwebtoken");   //引入JWT來頒發Token
const JWT_SIGN_PRIVATE_KEY = "JWT_SIGN_SECRET_FOR_INSAI"   //＊＊＊極密＊＊＊加密 Token 用的Private_Key

const app = express()
app.use(cors())
app.use(express.json());

// import { BaseURL, PasswordLengthMin } from '../src/BaseInfo';


const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'QhrSJjj%5%Q',
    database: 'practice_01',
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

app.post('/api/account/signup', (req, res) => {   //註冊帳號
    const confirm = "SELECT * From user where email = (?)";
    const sql = "INSERT INTO user ( `firstname`, `lastname`, `email`, `password` ) VALUES (?)";
    const values = [
        req.body.FirstName,
        req.body.LastName,
        req.body.Email,
        req.body.Password
    ]
    db.query(confirm, req.body.Email, (err, confirmData) => {   //確認欲註冊的帳戶是否存在
        if (err)
            return res.json("Error")
        if (confirmData.length > 0)
            return res.json("User exist");
        else
            db.query(sql, [values], (err, data) => {
                if (err) {
                    return res.json("Error");
                }
                return res.json("Success");
            })
    })
})

app.post('/api/account/login', (req, res) => {   //登入資訊驗證
    const sql = "SELECT * FROM user WHERE `email` = (?) AND `password` = (?)"
    const values = [
        req.body.Email,
        req.body.Password
    ]
    db.query(sql, [values[0], values[1]], (err, data) => {   //查詢登入資訊是否正確
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            const dateTime = Date.now();   //得到登入時間
            const UnixTimestamp = Math.floor(dateTime / 1000);   //將登入時間轉為UNIX格式
            const token = jwt.sign({ UserID: data[0].id, LoginTime: UnixTimestamp }, JWT_SIGN_PRIVATE_KEY, { expiresIn: "3 day" });   //產出Token

            return res.json({   //將夾帶前端需要的資訊回傳
                "Status": "Success",
                "Token": {
                    "UserID": data[0].id,
                    "LoginTime": dateTime,
                    "LoginTimeUNIX": UnixTimestamp,
                    "JWT_SIGN_PUBLIC_KEY": token
                }
            });
        }
        else
            return res.json("Failed");
    })
})

app.post('/api/project/addproject', (req, res) => {   //新增專案
    const confirm = "SELECT * From project where projectName = (?)";   //確認專案是否存在的命令
    const sql = "INSERT INTO project ( `UserID`, `projectName` ) VALUES (?)";   //新增專案的命令
    const values = [
        req.body.UserID,
        req.body.projectName
    ]
    db.query(confirm, req.body.projectName, (err, confirmData) => {   //確認專案是否存在
        if (err)
            return res.json("Error");
        if (confirmData.length > 0)
            return res.json("Project exist");
        else
            db.query(sql, [values], (err, data) => {   //專案不存在時新增專案
                if (err) {
                    return res.json("Error");
                }
                return res.json("Success");
            })

    })
})

app.get('/api/project/getproject', (req, res) => {   //查詢指定使用者的所有專案
    const sql = "SELECT * From project WHERE UserID = (?)";
    db.query(sql, req.query.UserID, (err, data) => {
        if (err) {
            return res.json(["Error"]);
        }
        res.json(data);   //回傳指定使用者的所有專案
    })
})

app.get('/api/project/searchproject' , (req, res) => {
  const confirm = "SELECT * From project where UserID = (?) AND projectName LIKE (?)";

  db.query( confirm, [req.query.UserID, "%"+req.query.projectName+"%"], (err, confirmData) => {
    if( err )
      return res.json("Failed");
    if( confirmData.length > 0)
      return res.json( confirmData );
    else
      return res.json("Failed");

  })
})

app.post('/api/project/deleteproject', (req, res) => {   //刪除指定使用者的指定專案
    const sql = "DELETE FROM project WHERE UserID = (?) AND projectName = (?)";
    db.query(sql, [req.body.UserID, req.body.projectName], (err) => {
        if (err) {
            return res.json(["Error", err])
        }
        return res.json(["Success"])
    })
})

app.get('/api/project/getstep', (req, res) => {   //不明
    const sql = "SELECT * FROM project WHERE username = (?) AND projectName = (?)";
    const values = [
        req.body.username,
        req.body.projectName
    ]
    db.query(sql, [values], (err, data) => {   //不明
        if (err) {
            return res.json(["Error", err])
        }
        if (data.length > 0) {
            return res.json(["Success"])
        }
        return res.json(["Failed"])
    })
})


app.post('/api/project/confirmstep', (req, res) => {   //不明
    const sql = "SELECT * FROM project WHERE username = (?) AND projectName = (?)";
    const values = [
        req.body.username,
        req.body.projectName
    ]
    db.query(sql, [values], (err, data) => {   //不明


    })
})

app.listen(8081, () => {   //監聽8081 port
    console.log("server is listening")
})