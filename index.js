var express = require('express');
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html')
})
const arrUserInfo = [];

io.on('connection', socket => {
    console.log('a');
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExist = arrUserInfo.some(e => e.ten === user.ten);
        socket.peerId = user.peerId;
        if (isExist) return socket.emit('DANG_KY_THAT_BAT');
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
        arrUserInfo.splice(index, 1);
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });
});

http.listen(4000)
