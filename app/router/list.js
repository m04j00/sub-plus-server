const express = require('express');
const router = express();
const connection = require('../mysql');

router.use(express.urlencoded({
    extended: false
  })); //application/x-www-form-urlencoded
  router.use(express.json());

router.get('/', function (req, res) {
    res.send('list');
});

router.get('/category/:category', function (req, res) {
    let category = req.params.category;
    let sql;
    if(category == -1){
        sql = 'SELECT * FROM list';
    }
    else sql = `SELECT * FROM list WHERE category = ${category}`;

    connection.query(sql, function (err, result) {
        if (err) return res.sendStatus(400);

        res.json(result);
        console.log("result : " + JSON.stringify(result));
    });
});
router.post('/posting', function (req, res) {
    let list = req.body;
    let id = list.organizer + list.category;
    console.log(id);
    let params = [id, list.title, list.category, list.matching_num, list.price, list.organizer, list.content];
    let sql = `INSERT INTO list(id, title, category, matching_num, price, organizer, content, current_num)  VALUES(?, ?, ?, ?, ?, ?, ?, 1)`;
    let memberSql = `INSERT INTO party_member(room, member_id) VALUES(?, ?)`;
    let memberParam = [id, list.id];
    connection.query(sql, params, function (err, result) {
        let resultCode = 404;
        let message = '등록 실패. 다시 시도해주세요!';
        if (err)
            console.log(err);

        else {
            connection.query(memberSql, memberParam, function (err, result) {
            })
            resultCode = 200;
            message = '등록 되었습니다.';
        }
        res.json({
            'code': resultCode,
            'message': message
        });
    })
})

module.exports = router;