const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const {clearModel} = require('./models/mongoFunctions')
// const User = require('./models/User')
const Game = require('./models/Game')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const playCross = io.of('/playCross')
const playChess = io.of('/playChess')
const chat = io.of('/chat')

require('./socket.io/playCross')(playCross)
require('./socket.io/playChess')(playChess)
require('./socket.io/chat')(chat)

const PORT = config.get('port') || 5000;

app.use(express.json({extended:true}))


app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/checkToken', async (req, res) => {
    try {
        const verify = jwt.verify(req.body.token, config.get('jwtSecret'))
        res.json({verify})
    } catch (e) {
        res.json({verify: false})
    }
})

// clearModel(Game)

async function start() {
    try {
        await mongoose.connect(config.get('db_uri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        server.listen(PORT, ()=> console.log ("started..."))
    } catch (e) {
        console.log('server error', e.message)
        process.exit(1)
    }
}

start()

