const express = require('express');
const router = express();
const bcrypt = require("bcryptjs");
const connection = require('../mysql');
var multer, storage, path, crypto;
multer = require('multer')
path = require('path');
crypto = require('crypto');
const fs = require('fs');

router.use(express.urlencoded({
    extended: false
})); //application/x-www-form-urlencoded
router.use(express.json());

var form = "<!DOCTYPE HTML><html><body>" +
    "<form method='post' action='/user/upload' enctype='multipart/form-data'>" +
    "<input type='file' name='upload'/>" +
    "<input type='submit' /></form>" +
    "</body></html>";

router.get('/', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(form);

});

storage = multer.diskStorage({
    destination: './app/uploads/',
    filename: function (req, file, cb) {
        return crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                return cb(err);
            }
            return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
        });
    }
});

// Post files
router.post("/upload", multer({
        storage: storage
    }).single('upload'),
    function (req, res) {
        console.log(req.file);
        console.log(req.body);
        res.redirect("/user/uploads/" + req.file.filename);
        console.log(req.file.filename);

        let sql = `UPDATE user SET img = ? WHERE email = ?`;
        let params = [req.file.filename, req.body.email];
        connection.query(sql, params, function (err, result) {
            if (err)
                console.log(err);
        })

        return res.status(200).end();
    });

router.get('/uploads/:upload', function (req, res) {
    file = req.params.upload;
    console.log(req.params.upload);
    var img = fs.readFileSync("./app/uploads/" + file);
    console.log("img", img);
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(img, 'binary');

});

router.post('/join', function (req, res) {
    let email = req.body.email;
    const salt = 10;
    const password = bcrypt.hashSync(req.body.password, salt); // 비밀번호 암호화

    let sql = `INSERT INTO user(email, password)  VALUES( ?, ?)`;
    let params = [email, password];
    let sqlEmailCheck = `select * from user where email = '${email}'`;

    connection.query(sqlEmailCheck, function (err, result) {
        let resultCode = 404;
        let message = '오류 발생. 다시 한 번 시도해주세요!';
        if (err)
            console.log(err);
        else if (result.length === 0) {
            connection.query(sql, params, function (err, result) {
                resultCode = 200;
                message = '회원가입 되었습니다.';
            })
        } else {
            resultCode = 204;
            message = '이미 가입한 이메일입니다.';
        }
        res.json({
            'code': resultCode,
            'message': message
        });
    })
});

// 추가 정보
router.post('/add-info', function (req, res) {
    let qb = req.body;
    let sql = `UPDATE user SET name = ? , tel = ?, account = ? WHERE email = ?`;
    let params = [qb.name, qb.tel, qb.account, qb.email];
    connection.query(sql, params, function (err, result) {
        let resultCode = 404;
        let message = '오류 발생. 다시 한 번 시도해주세요!';
        if (err)
            console.log(err);
        else if (result.length === 0) {
            resultCode = 200;
            message = '회원가입 되었습니다.';
        }
        res.json({
            'code': resultCode,
            'message': message
        });
    })
});
// 추가 정보
router.post('/ahkjoin', function (req, res) {
    let qb = req.body;
    let email = req.body.email;
    const salt = 10;
    const password = bcrypt.hashSync(req.body.password, salt); // 비밀번호 암호화

    let sql = `INSERT INTO user(email, password, name, tel, account, img)  VALUES(?, ?, ?, ?, ?, ?)`;
    
        let params = [email, password, qb.name, qb.tel, qb.account, qb.img];
        console.log(params);
    connection.query(sql, params, function (err, result) {
        if(err){
            console.log(err);
        }
        resultCode = 200;
        message = '회원가입 되었습니다.';
        res.json({
            'code': resultCode,
            'message': message
        });
    })
});
router.post('/login', function (req, res) {
    const email = req.body.email;
    const pw = req.body.password;
    const sql = 'select * from user where email = ?';

    connection.query(sql, email, function (err, result) {
        let resultCode = 404;
        let message = '오류 발생. 다시 한 번 시도해주세요!';
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 204;
                message = '가입하지 않은 이메일입니다.';
            } else if (!(bcrypt.compareSync(pw, result[0].password))) {
                resultCode = 204;
                message = '비밀번호가 일치하지 않습니다.';
            } else {
                resultCode = 200;
                message = '로그인 되었습니다.';
            }
        }
        res.json({
            'code': resultCode,
            'message': message,
            'id' : result[0].id,
            'name' : result[0].name,
            'img' : result[0].img
        });
    })
});
// info
router.get('/info/:make', function (req, res) {
    let name = req.query.name;
    // 유저 정보는 안드에 저장되어 있는 정보로 띄우고 가입한 파티 목록만 띄우기
    let sql = `select * from list where organizer = ?`;

    connection.query(sql, name, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                'code': 404,
                'message': '오류 발생. 다시 한 번 시도해주세요!'
            })
        }
        res.json(result);
    })
})
// info
router.get('/info', function (req, res) {
    let id = req.query.id;
    let name = req.query.name;
    let tab = req.query.tab;
    // 유저 정보는 안드에 저장되어 있는 정보로 띄우고 가입한 파티 목록만 띄우기
    let sql;
    let param = [];
    let room = name + '%';
    if(tab == 0){
        sql = `SELECT l.title, l.current_num, l.matching_num, l.id FROM list AS l JOIN party_member AS m ON m.room = l.id LIKE m.room = ?`;
        
        param = [room];
    }
    else {
        sql = `SELECT l.title, l.current_num, l.matching_num, l.id FROM list AS l JOIN party_member AS m ON m.room = l.id WHERE m.member_id = ? LIKE m.room != ?`;
        param = [id, room];
    }
    console.log(room)
    connection.query(sql, param, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                'code': 404,
                'message': '오류 발생. 다시 한 번 시도해주세요!'
            })
        }
        res.json(result);
    })
})
module.exports = router;