const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const fs = require("fs");
const path = require("path")
const multer = require("multer")

const jwt = require("jsonwebtoken");   //引入JWT來頒發Token
const JWT_SIGN_PRIVATE_KEY = "JWT_SIGN_SECRET_FOR_INSAI"   //＊＊＊極密＊＊＊加密 Token 用的Private_Key

const app = express()
app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'QhrSJjj%5%Q',
    database: 'practice_01',
});

db.connect((err) => {
    if (err) throw err;

    FOLDER_CREATE("");
    console.log("Connected to MySQL database!");
});

function API_ARCHITHCTURE(Status="Error", Message=null, Else=null){
    let structure = {
        "Status" : Status,
        "Message" : Message,
        "Error" : Else
    }
    // return JSON.stringify(structure)
    return structure

}

function FOLDER_CREATE(pathname){
    const dir = path.join( __dirname, `../public/projects${pathname}` );
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        return true
    }else{
        return false
    }
}

function FOLDER_DELETE(floderpath){
    if(fs.existsSync(floderpath)){
        fs.readdirSync(floderpath).forEach((file) => {
            const curPath = path.join(floderpath,file);
            if(fs.lstatSync(curPath).isDirectory()){
                FOLDER_DELETE(curPath);
            }
            else{
                fs.unlinkSync(curPath)
            }
        });
        fs.rmdirSync(floderpath)
        return true
    }else{
        return false
    }
}

app.post('/api/account/signup', (req, res) => {   //註冊帳號
    const confirm = "SELECT * From user WHERE email = (?)";
    const sql = "INSERT INTO user ( `firstname`, `lastname`, `email`, `password` ) VALUES (?)";
    const values = [
        req.body.FirstName,
        req.body.LastName,
        req.body.Email,
        req.body.Password
    ]
    db.query(confirm, req.body.Email, (err, confirmData) => {   //確認欲註冊的帳戶是否存在
        if (err) return res.json(API_ARCHITHCTURE())

        if (confirmData.length > 0)
            return res.json(API_ARCHITHCTURE("Failed", "Exist"));
        else
            db.query(sql, [values], (err, data) => {
                if (err) return res.json(API_ARCHITHCTURE());

                return res.json(API_ARCHITHCTURE("Success"));
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
        if (err) return res.json(API_ARCHITHCTURE());

        if (data.length > 0) {
            const dateTime = Date.now();   //得到登入時間
            const UnixTimestamp = Math.floor(dateTime / 1000);   //將登入時間轉為UNIX格式
            const token = jwt.sign({ UserID: data[0].id, LoginTime: UnixTimestamp }, JWT_SIGN_PRIVATE_KEY, { expiresIn: "3 day" });   //產出Token
            FOLDER_CREATE( `/${data[0].UserID}` );
            return res.json(   //將夾帶前端需要的資訊回傳
                API_ARCHITHCTURE(
                    "Success", 
                    {
                        "Token": {
                            "UserID": data[0].UserID,
                            "LoginTime": dateTime,
                            "LoginTimeUNIX": UnixTimestamp,
                            "JWT_SIGN_PUBLIC_KEY": token
                        }
                    }
                )
            );
        }
        else
            return res.json(API_ARCHITHCTURE("Failed"));
    })
})

app.post('/api/project/addproject', (req, res) => {   //新增專案
    const confirm = "SELECT * From project WHERE UserID = (?) AND projectName = (?)";   //確認專案是否存在的命令
    const sql = "INSERT INTO project ( `UserID`, `projectName` , `laststep` ) VALUES (?)";   //新增專案的命令
    const values = [
        req.body.UserID,
        req.body.projectName,
        0
    ]
    db.query(confirm, [req.body.UserID, req.body.projectName], (err, confirmData) => {   //確認專案是否存在
        if (err) return res.json(API_ARCHITHCTURE());

        if (confirmData.length > 0)
            return res.json(API_ARCHITHCTURE("Failed", "Exist"));
        else
            db.query(sql, [values], (err, data) => {   //專案不存在時新增專案
                if (err) return res.json(API_ARCHITHCTURE());

                return res.json(API_ARCHITHCTURE("Success"));
            })

    })
})

app.get('/api/project/getproject', (req, res) => {   //查詢指定使用者的所有專案
    const sql = "SELECT * From project WHERE UserID = (?)";
    db.query(sql, req.query.UserID, (err, data) => {
        if (err) return res.json(API_ARCHITHCTURE());
        
        res.json(API_ARCHITHCTURE("Success", data));   //回傳指定使用者的所有專案

    })
})

app.get('/api/project/searchproject' , (req, res) => {   //查詢指中使用者的指定專案
    const confirm = "SELECT * From project WHERE UserID = (?) AND projectName LIKE (?)";

  db.query( confirm, [req.query.UserID , "%"+req.query.projectName+"%"], (err, confirmData) => {
    if( err ) return res.json(API_ARCHITHCTURE());
    
    if( confirmData.length > 0)
      return res.json(API_ARCHITHCTURE("Success", confirmData));
    else
      return res.json(API_ARCHITHCTURE("Failed"));

  })
})

app.delete('/api/project/deleteproject', (req, res) => {   //刪除指定使用者的指定專案
    const sql_delproject = "DELETE FROM project WHERE ProjectID = (?)";
    const sql_delimages = "DELETE FROM images WHERE ProjectID = (?)";
    const UserID = req.query.UserID;
    const ProjectID = req.query.ProjectID;
    db.query(sql_delproject, [ ProjectID ] , (err,data) => {
        if (err)  return res.json(API_ARCHITHCTURE())

        db.query(sql_delimages, [ ProjectID ] , (err,data) => {
            if (err)  return res.json(API_ARCHITHCTURE())
    
            const dir = path.join(__dirname, `../public/projects/${UserID}/${ProjectID}`)
            FOLDER_DELETE(dir)
            return res.json(API_ARCHITHCTURE("Success"))
        })
    })
})

app.get('/api/project/step/getstep', (req, res) => {   //不明
    const sql = "SELECT laststep FROM project WHERE ProjectID = (?)";
    
    db.query(sql, req.query.ProjectID, (err, data) => {   //不明
        if (err) return res.json(API_ARCHITHCTURE())

        if (data.length > 0) {
            return res.json(API_ARCHITHCTURE("Success", data[0]))
        }
        return res.json(API_ARCHITHCTURE("Failed"))
    })
})


app.post('/api/project/step/setstep', (req, res) => {   //不明
    const sql_select = "SELECT laststep FROM project WHERE ProjectID = (?)";
    // const sql_insert = "INSERT INTO project ( `laststep` ) VALUES (?)";
    const sql_insert = "UPDATE project SET laststep = (?) WHERE ProjectID = (?)";

    db.query(sql_select, req.body.ProjectID, (err, previous_data) => {   //不明
        if (err) return res.json(API_ARCHITHCTURE())
        
        if(previous_data[0].laststep < req.body.setStep){
            db.query(sql_insert, [req.body.setStep, req.body.ProjectID], (err, data) => {   //不明
                if (err) return res.json(API_ARCHITHCTURE())

                return res.json(API_ARCHITHCTURE("Success"))
            })
        }else{
            return res.json(API_ARCHITHCTURE("Success"))
        }
    })
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const UserID = req.body.UserID;
        const ProjectID = req.body.ProjectID;
        const dir = path.join(__dirname, `../public/projects/${UserID}/${ProjectID}`);
        FOLDER_CREATE(`/${UserID}/${ProjectID}`)
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

app.post('/api/project/step/uploadImg', upload.array("file"), (req, res) => {
    const UserID = req.body.UserID;
    const ProjectID = req.body.ProjectID;
    const ImgPath = path.join( __dirname, `../public/projects/${UserID}/${ProjectID}` )
    if(fs.existsSync(ImgPath)){
        fs.readdirSync(ImgPath).forEach((file) => {
            const confirm = "SELECT * FROM images WHERE ImgName = (?) AND UserID = (?) AND ProjectID = (?)";
            const sql = "INSERT INTO images ( `ImgName`, `UserID`, `ProjectID` ) VALUES (?)"

            db.query( confirm, [ file, UserID, ProjectID ], ( err, data ) => {
                if(err) return res.json(API_ARCHITHCTURE())
                if( data.length > 0) return 0
                else{
                    values = [
                        file,
                        UserID,
                        ProjectID
                    ]
                    db.query( sql, [ values], ( err, data ) => {
                        if(err) return res.json(API_ARCHITHCTURE())
        
                    })
                }
            } )
        })
        return res.json(API_ARCHITHCTURE("Success"))
    }else{
        return res.json(API_ARCHITHCTURE())
    }

})

app.get('/api/project/step/getimg', (req, res) => {   
    const sql = "SELECT * From images WHERE ProjectID = (?)";
    db.query(sql, req.query.ProjectID , (err, data) => {
        if (err) return res.json(API_ARCHITHCTURE("Error", err));
        
        res.json(API_ARCHITHCTURE("Success", data));
    })
})

app.delete('/api/project/step/deleteimg', (req, res) => {   //刪除指定使用者的指定專案
    const select = "SELECT * FROM images WHERE ImgID = (?)";
    const sql = "DELETE FROM images WHERE ImgID = (?)";

    db.query(select, [ req.query.ImgID ] , ( err , select_data ) => {
        if (err) return res.json(API_ARCHITHCTURE())

        const UserID = select_data[0].UserID;
        const ProjectID = select_data[0].ProjectID;
        const ImgName = select_data[0].imgName;
        const dir = path.join(__dirname,`../public/projects/${UserID}/${ProjectID}/${ImgName}`)
        
        db.query(sql, [ req.query.ImgID ] , ( err , data ) => {
            if (err) return res.json(API_ARCHITHCTURE())

            try{
                fs.unlinkSync( dir, (err) => {
                    if(err) return res.json(API_ARCHITHCTURE());
        
                    console.log(`${ImgName} delete complete`)
                })
            }catch(err){
                
            }
            return res.json(API_ARCHITHCTURE("Success"))
        })
    })
})

app.post('/api/project/step/uploadReq', (req, res) => {  
    if(req.body.Req){
        const UserID = req.body.UserID;
        const ProjectID = req.body.ProjectID;
        FOLDER_CREATE(`/${UserID}/${ProjectID}`)
        const dir = `../public/projects/${UserID}/${ProjectID}/requirement.json`
        fs.writeFile( dir, JSON.stringify(req.body.Req, null, 2), (err) => {
            console.log("123")
            if(err){
                console.log('An error has occured')
                throw(err)
            }
        })
        return res.json(API_ARCHITHCTURE("Success"))
    }else{
        return res.json(API_ARCHITHCTURE("Failed"))
    }
})

app.get('/api/project/step/getReq', (req, res) => {  
    if(req.query.ProjectID){
        return res.json(API_ARCHITHCTURE("Success",
            {
                StandardDeviation : 1,
                SpecificLevel : 2,
                Chance : 3
            }
        ))
    }else{
        return res.json(API_ARCHITHCTURE("Failed"))
    }
})

app.listen(8081, () => {   //監聽8081 port
    console.log("server is listening")
})