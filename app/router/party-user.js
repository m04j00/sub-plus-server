const express = require('express');
const router = express();
const connection = require('../mysql');

router.use(express.urlencoded({
    extended: false
  })); //application/x-www-form-urlencoded
  router.use(express.json());

// 파티 가입
router.post('/applicant', function (req, res) {
    let qb = req.body;
    console.log(qb.room);
    let insertSql = `INSERT INTO applicant(room, member_id) VALUES(?, ?)`;
    let checkSQL = `select * from applicant where room = ? AND member_id = ?`;
    let insertParam = [qb.room, qb.member_id];

    connection.query(checkSQL, insertParam, function (err, result) {
        if (err) {
            console.log(err);
        } else if (result.length != 0) {
            res.json({
                'code': 204,
                'message': '이미 가입된 파티이거나 가입 요청 중인 파티입니다.'
            });
        } else {
            connection.query(insertSql, insertParam, function (err, result) {
                if (err) {
                    console.log(err);
                    res.json({
                        'code': 404,
                        'message': '오류 발생. 다시 한 번 시도해주세요!'
                    })
                } else {
                    res.json({
                        'code': 200,
                        'message': '파티에 가입되었습니다.'
                    });
                }
            });
        }
    })

});

//파티 수락
router.post('/accept', function (req, res) {
    let qb = req.body;
    let deleteSql = `DELETE FROM applicant where room = ? AND member_id = ?`;
    let insertSql = `INSERT INTO party_member(room, member_id) VALUES(?, ?)`;
    let updateSql = `UPDATE list SET current_member = ? WHERE id = ? `;
    let params = [qb.room, qb.member_id];
    let updateParam = [qb.current_member, qb.room];
    connection.query(insertSql, params, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                'code': 404,
                'message': '오류 발생. 다시 한 번 시도해주세요!'
            })
        }
    })
    connection.query(deleteSql, params, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                'code': 404,
                'message': '오류 발생. 다시 한 번 시도해주세요!'
            })
        } else {
            connection.query(updateSql, updateParam, function (err, result) {
                res.json({
                    'code': 200,
                    'message': `파티에 구성원이 추가되었습니다.`
                })
            })
        }
    })
});
//거절
router.post('/refusal', function (req, res) {
    let qb = req.body;
    let deleteSql = `DELETE FROM applicant where room = ? AND member_id = ?`;
    let params = [qb.room, qb.member_id];

    connection.query(deleteSql, params, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                'code': 404,
                'message': '오류 발생. 다시 한 번 시도해주세요!'
            })
        } else {
            res.json({
                'code': 200,
                'message': `해당 신청자를 거절했습니다.`
            })
        }
    })
});

// 구성원 목록
router.get('/member_list', function (req, res) {
    let room = req.query.room;
    let sql = `SELECT u.img, u.name FROM user AS u JOIN party_member AS m ON m.member_id = u.id WHERE m.room = ?`;

    connection.query(sql, room, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                'code': 404,
                'message': '오류 발생. 다시 한 번 시도해주세요!'
            })
        }
        console.log(result);
        res.json(result);
    })
});

// 희망자 목록
router.get('/applicant', function (req, res) {
    let room = req.query.room;
    let sql = `select * from applicant where room = ?`;

    connection.query(sql, room, function (err, result) {
        if (err) {
            console.log(err);
            res.json({
                'code': 404,
                'message': '오류 발생. 다시 한 번 시도해주세요!'
            })
        }
        res.json(result);
    })
});

module.exports = router;
