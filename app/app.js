const express = require('express');
const app = express();
const PORT = 3000;
process.send = process.send || function () { };

const listRouter = require('./router/list');
app.use('/list', listRouter);
const userRouter = require('./router/user');
app.use('/user', userRouter);

app.get('/', function(req, res){
  res.send('앱잼 20회 서버');
});


app.listen(PORT, () => console.log('3000번 포트 대기'));