var http = require('http');
var express = require('express');
var app = express();

// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');


// static file setting
app.use(express.static('public'));

//route setup
var index = require('./routes/index');
app.use('/', index);

//port setup
var port = process.env.PORT || 3000;
//애져 연결을 위해 process.env.PORT 작성한것임 만약 로컬에서 돌릴거면 그냥 3000만 써도됨


var server = http.createServer(app);
server.listen(port);

//azure 연결
var azure = require('azure');
var hubName = '';
var connectionString = '';
var notificationHubService = azure.createNotificationHubService(hubName,connectionString);


var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){ //on은 이벤트(마우스클릭 서버접속 등등의 요청)를 기다림. 그니까 커넥션이 들어왔을 경우 다음 함수들을 실행
    socket.emit('toclient',{msg:'Welcome !'}); //chat.ejs보면 toclient로 받는 부분이 있음 emit은 저 toclient를 내보낸다! 라는 기능
    socket.on('fromclient',function(data){
        socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
        socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
        console.log('Message from client :'+data.msg);
    });
});