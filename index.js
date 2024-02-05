const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require("cors");
const router = require('./bin/router');

/*################################################
    各定数
################################################*/
const PORT = 8081;
module.exports.host = "http://maimai-fve.maya2silence.com";


process.env.TZ = "Asia/Tokyo";

app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(`${__dirname}/public`, { dotfiles: 'allow' }));
app.use(router);

io.on('connection', function (socket) {
    socket.on('message', function (data) {
        console.log('message: ' + data);
        io.emit('message', data);
    });
});

http.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});

