const express = require('express');
const router = express();
const connection = require('../mysql');

router.get('/', function (req, res) {
    res.send('list');
});

router.get('/category/:category', function (req, res) {
    let category = req.params.category;
    let sql = 'SELECT * FROM list WHERE category = ?';

    connection.query(sql, category, function (err, result) {
        if (err) return res.sendStatus(400);

        res.json(result);
        console.log("result : " + JSON.stringify(result));
    });
})

router.post('/posting', function (req, res) {
    let list = req.body;
    let sql = `INSERT INTO(title, content, category, matching_num, price, organizer) list VALUES( '${list.title}', '${list.content}', ${list.category}, ${list.num}, ${list.price}, '${list.oraniser}'`;
    connection.query(sql, function (err, result) {
        let resultCode = 404;
        let message = '등록 실패. 다시 시도해주세요!';
        if (err)
            console.log(err);

        else {
            resultCode = 200;
            message = '등록 되었습니다.';
        }
        res.json({
            'code': resultCode,
            'message': message
        });
    })
})