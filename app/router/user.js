const express = require('express');
const router = express();
const bcrypt = require("bcryptjs");
const connection = require('../mysql');

router.use(express.urlencoded({
    extended: false
})); //application/x-www-form-urlencoded
router.use(express.json());

router.get('/', function (req, res) {
    res.send('user');
});

router.post('/join', function (req, res) {
    let email = req.body.email;
    const salt = 10;
    const password = bcrypt.hashSync(req.body.password, salt); // 비밀번호 암호화

    let sql = `INSERT INTO user(email, password)  VALUES( '${req.body.email}')`;
    let params = [email, password];
    let sqlEmailCheck = `select * from user where email = '${email}'`;

    connection.query(sqlEmailCheck, function (err, result) {
        let resultCode = 404;
        let message = '오류 발생. 다시 한 번 시도해주세요!';
        if (err)
            console.log(err);
        else if (result.length === 0) {
            resultCode = 200;
            message = '등록 되었습니다.';
            connection.query(sql, params, function (err, result) {
                resultCode = 200;
                message = '회원가입에 성공했습니다.';
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
    let sql =  `UPDATE user SET name = ? , tel = ?, account = ? WHERE email = ?`;
    connection.query(sqlEmailCheck, function (err, result) {
        let resultCode = 404;
        let message = '오류 발생. 다시 한 번 시도해주세요!';
        if (err)
            console.log(err);
        else if (result.length === 0) {
            resultCode = 200;
            message = '등록 되었습니다.';
            connection.query(sql, function (err, result) {
                resultCode = 200;
                message = '회원가입에 성공했습니다.';
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
module.exports = router;